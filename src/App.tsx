import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './lib/store';
import { supabase } from './lib/supabase';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import NewEntry from './pages/NewEntry';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AIInsights from './pages/AIInsights';
import Auth from './pages/Auth';

function App() {
  const darkMode = useStore((state) => state.darkMode);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    // Handle initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchAndSetUser(session.user.id, session.user.email!);
      }
    });

    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchAndSetUser(session.user.id, session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const fetchAndSetUser = async (userId: string, email: string) => {
    try {
      // First try to fetch existing user
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single();

      if (existingUser) {
        setUser(existingUser);
        return;
      }

      // If user doesn't exist, create new profile
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: email,
            notification_preferences: {
              enabled: false,
              times: [],
              days: [],
            },
            medication_reminder: {
              enabled: false,
              times: [],
            },
            dark_mode: false,
            subscription_tier: 'free',
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return;
      }

      if (newUser) {
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error in fetchAndSetUser:', error);
    }
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-gray-50 dark:bg-[#0F0F17] text-gray-900 dark:text-white min-h-screen">
          {!user ? (
            <Auth />
          ) : (
            <>
              <div className="container mx-auto px-4 pb-20">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/new-entry" element={<NewEntry />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/ai-insights" element={<AIInsights />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Navigation />
            </>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
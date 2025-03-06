import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User, Settings, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/new-entry', icon: PlusCircle, label: 'New Entry', primary: true },
    { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/[0.02] backdrop-blur-xl border-t border-white/[0.05] dark:bg-midnight-900/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center p-2 ${
                item.primary ? 'text-cyan-400' : 'text-gray-500 dark:text-gray-400'
              } ${location.pathname === item.path ? 'text-magenta-400' : ''}`}
            >
              {location.pathname === item.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-magenta-400"
                  transition={{ duration: 0.2 }}
                />
              )}
              <item.icon className={`w-6 h-6 ${item.primary ? 'w-8 h-8' : ''}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
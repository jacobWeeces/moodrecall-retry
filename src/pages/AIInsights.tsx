import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';

const AIInsights = () => {
  const user = useStore((state) => state.user);
  const [insights, setInsights] = useState<{ id: string; content: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchInsights = async () => {
      const { data } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setInsights(data);
      }
    };

    fetchInsights();
  }, [user]);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">AI Insights</h1>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6"
          >
            <p className="text-sm text-gray-400 mb-2">
              {new Date(insight.created_at).toLocaleDateString()}
            </p>
            <p className="text-lg">{insight.content}</p>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No insights available yet. Keep tracking your mood to receive personalized insights!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
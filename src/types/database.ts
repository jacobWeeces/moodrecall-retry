export interface MoodEntry {
  id: string;
  user_id: string;
  mood_score: number;
  notes: string;
  medication_taken: boolean;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  notification_preferences: {
    enabled: boolean;
    times: string[];
    days: string[];
  };
  medication_reminder: {
    enabled: boolean;
    times: string[];
  };
  dark_mode: boolean;
  subscription_tier: 'free' | 'premium' | 'pro';
}
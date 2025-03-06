/*
  # Initial Schema for MoodRecall App

  1. New Tables
    - users
      - Custom user data and preferences
    - mood_entries
      - User mood tracking entries
    - ai_insights
      - Daily AI-generated insights
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Users table for storing custom user data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  notification_preferences jsonb DEFAULT '{"enabled": false, "times": [], "days": []}'::jsonb,
  medication_reminder jsonb DEFAULT '{"enabled": false, "times": []}'::jsonb,
  dark_mode boolean DEFAULT false,
  subscription_tier text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  mood_score integer NOT NULL CHECK (mood_score >= 0 AND mood_score <= 10),
  notes text,
  medication_taken boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- AI insights table
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own mood entries"
  ON mood_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON mood_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
  ON mood_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own insights"
  ON ai_insights
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX mood_entries_user_id_idx ON mood_entries(user_id);
CREATE INDEX mood_entries_created_at_idx ON mood_entries(created_at);
CREATE INDEX ai_insights_user_id_idx ON ai_insights(user_id);
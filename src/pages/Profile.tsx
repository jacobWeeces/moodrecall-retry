import React from 'react';
import { useStore } from '../lib/store';

const Profile = () => {
  const moodEntries = useStore((state) => state.moodEntries);
  
  const calculateStats = () => {
    if (moodEntries.length === 0) return null;

    const scores = moodEntries.map(entry => entry.mood_score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const streak = calculateStreak();
    const totalEntries = moodEntries.length;
    const medicationAdherence = calculateMedicationAdherence();

    return { average, streak, totalEntries, medicationAdherence };
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const hasEntry = moodEntries.some(entry => {
        const entryDate = new Date(entry.created_at);
        return entryDate.toDateString() === date.toDateString();
      });

      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateMedicationAdherence = () => {
    const last30Days = moodEntries.filter(entry => {
      const entryDate = new Date(entry.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return entryDate >= thirtyDaysAgo;
    });

    if (last30Days.length === 0) return 0;

    const takenCount = last30Days.filter(entry => entry.medication_taken).length;
    return (takenCount / last30Days.length) * 100;
  };

  const stats = calculateStats();

  if (!stats) {
    return (
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <p>Start tracking your mood to see your statistics!</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-sm text-gray-400 mb-1">Current Streak</h2>
          <p className="text-3xl font-bold text-cyan-400">{stats.streak} days</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-sm text-gray-400 mb-1">Total Entries</h2>
          <p className="text-3xl font-bold text-magenta-400">{stats.totalEntries}</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-sm text-gray-400 mb-1">Average Mood</h2>
          <p className="text-3xl font-bold text-blue-400">{stats.average.toFixed(1)}</p>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <h2 className="text-sm text-gray-400 mb-1">Medication Adherence</h2>
          <p className="text-3xl font-bold text-green-400">{stats.medicationAdherence.toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
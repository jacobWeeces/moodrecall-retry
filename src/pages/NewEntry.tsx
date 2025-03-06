import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../lib/store';
import * as Slider from '@radix-ui/react-slider';

const NewEntry = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [moodScore, setMoodScore] = useState(5);
  const [notes, setNotes] = useState('');
  const [medicationTaken, setMedicationTaken] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { error } = await supabase
      .from('mood_entries')
      .insert([
        {
          user_id: user.id,
          mood_score: moodScore,
          notes,
          medication_taken: medicationTaken,
        },
      ]);

    if (!error) {
      navigate('/');
    }
  };

  const getMoodDescription = (score: number) => {
    if (score <= 2) return 'Severe Depression';
    if (score <= 4) return 'Mild Depression';
    if (score === 5) return 'Neutral';
    if (score <= 7) return 'Elevated';
    return 'Mania';
  };

  const getMoodColor = (score: number) => {
    if (score <= 2) return 'from-red-500 to-red-600';
    if (score <= 4) return 'from-orange-500 to-orange-600';
    if (score === 5) return 'from-blue-500 to-blue-600';
    if (score <= 7) return 'from-green-500 to-green-600';
    return 'from-purple-500 to-purple-600';
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">New Mood Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <div className="flex flex-col items-center mb-8">
            <div className={`text-center p-4 rounded-full bg-gradient-to-r ${getMoodColor(moodScore)} mb-2`}>
              <span className="text-2xl font-bold text-white">{moodScore}</span>
            </div>
            <p className="text-lg font-medium">{getMoodDescription(moodScore)}</p>
          </div>
          
          <Slider.Root
            className="relative flex items-center select-none touch-none h-32 w-full"
            value={[moodScore]}
            onValueChange={(value) => setMoodScore(value[0])}
            max={10}
            step={1}
            orientation="vertical"
          >
            <Slider.Track className="relative bg-white/20 rounded-full w-2 h-full">
              <Slider.Range className="absolute bg-gradient-to-t from-red-500 via-blue-500 to-purple-500 rounded-full w-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-6 h-6 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </Slider.Root>
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <label className="block mb-2 text-sm font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full h-32 bg-white/5 rounded-lg border border-white/10 p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="How are you feeling today?"
          />
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={medicationTaken}
              onChange={(e) => setMedicationTaken(e.target.checked)}
              className="form-checkbox h-5 w-5 text-cyan-400 rounded focus:ring-cyan-400"
            />
            <span>I took my medication today</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-400 text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default NewEntry;
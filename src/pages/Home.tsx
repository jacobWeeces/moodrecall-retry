import React from 'react';
import { useStore } from '../lib/store';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Home = () => {
  const moodEntries = useStore((state) => state.moodEntries);

  const data = {
    labels: moodEntries.map(entry => new Date(entry.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood Score',
        data: moodEntries.map(entry => entry.mood_score),
        fill: true,
        borderColor: 'rgb(6, 182, 212)',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Mood History</h1>
      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] rounded-2xl p-4">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Home;
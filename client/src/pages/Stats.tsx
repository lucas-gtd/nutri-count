import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../lib/api';

export default function Stats() {
  const [data, setData] = useState<any[]>([]);
  const [range, setRange] = useState(7);

  useEffect(() => {
    loadStats();
  }, [range]);

  async function loadStats() {
    const to = new Date().toISOString().split('T')[0];
    const from = new Date(Date.now() - range * 86400000)
      .toISOString()
      .split('T')[0];
    const stats = await api.getStats(from, to);
    setData(stats);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setRange(7)}
            className={`px-3 py-1 rounded text-sm ${
              range === 7 ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setRange(30)}
            className={`px-3 py-1 rounded text-sm ${
              range === 30 ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}
          >
            30 jours
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#16a34a"
              name="Calories ingérées"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#dc2626"
              name="Objectif (TDEE)"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

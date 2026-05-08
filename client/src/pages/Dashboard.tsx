import { useEffect, useState } from 'react';
import { api } from '../lib/api';

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [diary, exs] = await Promise.all([
      api.getDiary(today()),
      api.getExercises(today()),
    ]);
    setData(diary);
    setExercises(exs);
  }

  if (!data) return <div className="text-center py-8">Chargement...</div>;

  const { totals, metrics } = data;
  const exerciseCalories = exercises.reduce(
    (sum, e) => sum + Number(e.calories_burned),
    0,
  );
  const adjustedRemaining = metrics.remaining + exerciseCalories;
  const progress = metrics.tdee > 0
    ? Math.min((totals.calories / metrics.tdee) * 100, 100)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>

      {/* Calorie ring */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#16a34a"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${(progress / 100) * 314} 314`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold">{totals.calories}</span>
            <span className="text-xs text-gray-500">/ {metrics.tdee} kcal</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">BMR :</span> {metrics.bmr} kcal
          </div>
          <div className="text-sm">
            <span className="font-medium">TDEE :</span> {metrics.tdee} kcal
          </div>
          <div className="text-sm">
            <span className="font-medium">TEF :</span> {metrics.tef} kcal
          </div>
          <div className="text-sm">
            <span className="font-medium">Exercices :</span> {exerciseCalories}{' '}
            kcal
          </div>
          <div className="text-sm font-bold text-green-600">
            Restant : {adjustedRemaining} kcal
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totals.proteins}g
          </div>
          <div className="text-sm text-gray-500">Protéines</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {totals.carbs}g
          </div>
          <div className="text-sm text-gray-500">Glucides</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{totals.fats}g</div>
          <div className="text-sm text-gray-500">Lipides</div>
        </div>
      </div>

      {/* Meals list */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Repas du jour</h2>
        {data.entries.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Aucun repas enregistré aujourd'hui
          </p>
        ) : (
          <ul className="divide-y">
            {data.entries.map((entry: any) => (
              <li key={entry.id} className="py-2 flex justify-between">
                <div>
                  <span className="font-medium">{entry.food.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {entry.quantity_g}g — {entry.meal_type}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {Math.round(
                    (Number(entry.food.calories_per_100g) *
                      Number(entry.quantity_g)) /
                      100,
                  )}{' '}
                  kcal
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

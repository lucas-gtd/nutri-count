import { useState, useEffect } from 'react';
import { api } from '../lib/api';

function today() {
  return new Date().toISOString().split('T')[0];
}

export default function ExercisePage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    const data = await api.getExercises(today());
    setExercises(data);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.addExercise({
      name,
      duration_min: Number(duration),
      calories_burned: Number(calories),
      date: today(),
    });
    setName('');
    setDuration('');
    setCalories('');
    loadExercises();
  };

  const handleDelete = async (id: string) => {
    await api.deleteExercise(id);
    loadExercises();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exercices</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Ajouter un exercice</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Course, musculation..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Durée (min)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Calories brûlées
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Ajouter
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">Exercices du jour</h2>
        {exercises.length === 0 ? (
          <p className="text-gray-400 text-sm">Aucun exercice aujourd'hui</p>
        ) : (
          <ul className="divide-y">
            {exercises.map((ex) => (
              <li key={ex.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">{ex.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {ex.duration_min} min
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    -{ex.calories_burned} kcal
                  </span>
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

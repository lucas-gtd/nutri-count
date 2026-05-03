import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '',
    sex: 'male',
    height_cm: '',
    weight_kg: '',
    activity_level: 'moderate',
    goal: 'maintain',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.updateProfile({
      age: Number(form.age),
      sex: form.sex,
      height_cm: Number(form.height_cm),
      weight_kg: Number(form.weight_kg),
      activity_level: form.activity_level,
      goal: form.goal,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-semibold mb-6">Configurer votre profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Âge</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sexe</label>
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Taille (cm)
              </label>
              <input
                type="number"
                value={form.height_cm}
                onChange={(e) =>
                  setForm({ ...form, height_cm: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Poids (kg)
              </label>
              <input
                type="number"
                value={form.weight_kg}
                onChange={(e) =>
                  setForm({ ...form, weight_kg: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Niveau d'activité
            </label>
            <select
              value={form.activity_level}
              onChange={(e) =>
                setForm({ ...form, activity_level: e.target.value })
              }
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="sedentary">Sédentaire</option>
              <option value="light">Légèrement actif</option>
              <option value="moderate">Modérément actif</option>
              <option value="active">Actif</option>
              <option value="very_active">Très actif</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Objectif</label>
            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="lose">Perdre du poids</option>
              <option value="maintain">Maintenir</option>
              <option value="gain">Prendre du poids</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

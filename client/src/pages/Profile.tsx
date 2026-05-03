import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function ProfilePage() {
  const [form, setForm] = useState({
    age: '',
    sex: 'male',
    height_cm: '',
    weight_kg: '',
    activity_level: 'moderate',
    goal: 'maintain',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const profile = await api.getProfile();
    if (profile) {
      setForm({
        age: String(profile.age || ''),
        sex: profile.sex || 'male',
        height_cm: String(profile.height_cm || ''),
        weight_kg: String(profile.weight_kg || ''),
        activity_level: profile.activity_level || 'moderate',
        goal: profile.goal || 'maintain',
      });
    }
  }

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
    setMessage('Profil mis à jour !');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Mon profil</h1>

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded">{message}</div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
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
              onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
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
              onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
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
  );
}

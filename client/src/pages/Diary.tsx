import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import BarcodeScanner from '../components/BarcodeScanner';

function today() {
  return new Date().toISOString().split('T')[0];
}

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

const mealLabels: Record<MealType, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  dinner: 'Dîner',
  snack: 'Collation',
};

export default function Diary() {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [barcode, setBarcode] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [quantity, setQuantity] = useState('100');
  const [message, setMessage] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleScannedBarcode = useCallback(async (scannedBarcode: string) => {
    setShowScanner(false);
    setBarcode(scannedBarcode);
    try {
      const food = await api.getFoodByBarcode(scannedBarcode);
      setSelectedFood(food);
      setSearchResults([]);
    } catch {
      setMessage('Produit non trouvé');
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const results = await api.searchFoods(searchQuery);
    setSearchResults(results);
  };

  const handleBarcode = async () => {
    if (!barcode.trim()) return;
    try {
      const food = await api.getFoodByBarcode(barcode);
      setSelectedFood(food);
      setSearchResults([]);
    } catch {
      setMessage('Produit non trouvé');
    }
  };

  const handleAdd = async () => {
    if (!selectedFood) return;
    await api.addDiaryEntry({
      food_id: selectedFood.id,
      meal_type: selectedMeal,
      quantity_g: Number(quantity),
      date: today(),
    });
    setMessage(
      `${selectedFood.name} ajouté (${quantity}g) au ${mealLabels[selectedMeal]}`,
    );
    setSelectedFood(null);
    setQuantity('100');
    setSearchResults([]);
    setSearchQuery('');
    setBarcode('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Journal alimentaire</h1>

      {/* Meal type selector */}
      <div className="flex gap-2">
        {(Object.keys(mealLabels) as MealType[]).map((meal) => (
          <button
            key={meal}
            onClick={() => setSelectedMeal(meal)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedMeal === meal
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {mealLabels[meal]}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Rechercher un aliment
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Nom de l'aliment..."
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Chercher
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Ou scanner un code-barre
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBarcode()}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="Code-barre..."
            />
            <button
              onClick={handleBarcode}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Valider
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4h2v2H4V4zm0 4h2v2H4V8zm0 4h2v2H4v-2zm4-8h2v2H8V4zm0 4h2v2H8V8zm0 4h2v2H8v-2zm4-8h2v2h-2V4zm0 4h2v2h-2V8zm0 4h2v2h-2v-2z"/>
              </svg>
              Caméra
            </button>
          </div>
        </div>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-2">Résultats</h3>
          <ul className="divide-y">
            {searchResults.map((food) => (
              <li
                key={food.id}
                className="py-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 px-2 rounded"
                onClick={() => {
                  setSelectedFood(food);
                  setSearchResults([]);
                }}
              >
                <div>
                  <span className="font-medium">{food.name}</span>
                  {food.brand && (
                    <span className="text-gray-500 text-sm ml-2">
                      {food.brand}
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {food.calories_per_100g} kcal/100g
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selected food + quantity */}
      {selectedFood && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-medium">
            {selectedFood.name}
            {selectedFood.brand && (
              <span className="text-gray-500 text-sm ml-2">
                ({selectedFood.brand})
              </span>
            )}
          </h3>
          <div className="text-sm text-gray-500">
            Pour 100g : {selectedFood.calories_per_100g} kcal |{' '}
            P: {selectedFood.proteins_per_100g}g |{' '}
            G: {selectedFood.carbs_per_100g}g |{' '}
            L: {selectedFood.fats_per_100g}g
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Quantité (g)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border rounded-md px-3 py-2 w-32"
              />
            </div>
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-6 py-2 rounded-md mt-5"
            >
              Ajouter
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="bg-green-50 text-green-700 p-3 rounded">{message}</div>
      )}

      {showScanner && (
        <BarcodeScanner
          onScan={handleScannedBarcode}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

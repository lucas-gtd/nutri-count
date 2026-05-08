const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Auth
  register: (email: string, password: string) =>
    request<{ access_token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Profile
  getProfile: () => request<any>('/profile'),
  updateProfile: (data: any) =>
    request<any>('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Foods
  searchFoods: (q: string) => request<any[]>(`/foods/search?q=${encodeURIComponent(q)}`),
  searchFoodsOff: (q: string) => request<any[]>(`/foods/off-search?q=${encodeURIComponent(q)}`),
  getFoodByBarcode: (barcode: string) => request<any>(`/foods/barcode/${barcode}`),
  importFoodFromOff: (data: any) =>
    request<any>('/foods/import', { method: 'POST', body: JSON.stringify(data) }),
  createFood: (data: any) =>
    request<any>('/foods', { method: 'POST', body: JSON.stringify(data) }),

  // Diary
  getDiary: (date: string) => request<any>(`/diary?date=${date}`),
  addDiaryEntry: (data: any) =>
    request<any>('/diary', { method: 'POST', body: JSON.stringify(data) }),
  deleteDiaryEntry: (id: string) =>
    request<void>(`/diary/${id}`, { method: 'DELETE' }),

  // Exercises
  getExercises: (date: string) => request<any[]>(`/exercises?date=${date}`),
  addExercise: (data: any) =>
    request<any>('/exercises', { method: 'POST', body: JSON.stringify(data) }),
  deleteExercise: (id: string) =>
    request<void>(`/exercises/${id}`, { method: 'DELETE' }),

  // Stats
  getStats: (from: string, to: string) =>
    request<any[]>(`/stats?from=${from}&to=${to}`),
};

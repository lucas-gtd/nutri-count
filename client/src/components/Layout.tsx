import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-100'
    }`;

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-green-600 mr-4">
              NutriCount
            </span>
            <NavLink to="/" end className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/diary" className={linkClass}>
              Journal
            </NavLink>
            <NavLink to="/exercise" className={linkClass}>
              Exercices
            </NavLink>
            <NavLink to="/stats" className={linkClass}>
              Stats
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              Profil
            </NavLink>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Déconnexion
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

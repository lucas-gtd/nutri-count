import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-100'
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-green-600 mr-4">
              NutriCount
            </span>
            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
              <NavLink to="/diary" className={linkClass}>Journal</NavLink>
              <NavLink to="/exercise" className={linkClass}>Exercices</NavLink>
              <NavLink to="/stats" className={linkClass}>Stats</NavLink>
              <NavLink to="/profile" className={linkClass}>Profil</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="hidden sm:block text-sm text-red-600 hover:text-red-800"
            >
              Déconnexion
            </button>
            {/* Hamburger */}
            <button
              className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t px-4 py-2 flex flex-col gap-1 bg-white">
            <NavLink to="/" end className={linkClass} onClick={closeMobile}>Dashboard</NavLink>
            <NavLink to="/diary" className={linkClass} onClick={closeMobile}>Journal</NavLink>
            <NavLink to="/exercise" className={linkClass} onClick={closeMobile}>Exercices</NavLink>
            <NavLink to="/stats" className={linkClass} onClick={closeMobile}>Stats</NavLink>
            <NavLink to="/profile" className={linkClass} onClick={closeMobile}>Profil</NavLink>
            <button
              onClick={() => { logout(); closeMobile(); }}
              className="text-left px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Déconnexion
            </button>
          </div>
        )}
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

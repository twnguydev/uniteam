import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-2 min-h-max">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl mr-12 hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">UniTeam</Link>
          </div>
          <div className="flex justify-between">
            {user && (
              <>
                <Link to="/calendar" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Calendrier</Link>
                <Link to={`/member/${user.id}/schedule`} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Mon agenda</Link>
              </>
            )}
            {user?.admin && (
              <Link to="/admin/schedule" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Administration</Link>
            )}
            {user && (
              <>
                <Link to="/" onClick={logout} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Déconnexion</Link>
                <div className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Bienvenue, {user.firstname} {user.lastname} !</div>
              </>
            )}
            {!user && (
              <Link to="/auth" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Accès membre</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
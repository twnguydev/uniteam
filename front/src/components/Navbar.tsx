import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { NotificationNavbar } from './Notification';

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  return (
    <div className={`fixed inset-0 bg-gray-800 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Link to="/" onClick={onClose} className="text-white mb-10 text-xl mr-12 hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">UniTeam</Link>
          </div>
          <Link to="/calendar" onClick={onClose} className="text-white hover:text-gray-300 py-2 font-medium">Calendrier</Link>
          <Link to={user ? `/member/${user.id}/schedule` : '/'} onClick={onClose} className="text-white hover:text-gray-300 py-2 font-medium">Mon agenda</Link>
          <NotificationNavbar />
          {user?.is_admin && (
            <Link to="/admin/schedule" onClick={onClose} className="text-white hover:text-gray-300 py-2 font-medium">Administration</Link>
          )}
          {user && (
            <>
              <Link to="/" onClick={() => { logout(); onClose(); }} className="text-white hover:text-gray-300 py-2 font-medium">Déconnexion</Link>
              <div className="text-white py-2 font-medium">Bienvenue, {user.firstName} {user.lastName} !</div>
            </>
          )}
          {!user && (
            <Link to="/auth" onClick={onClose} className="text-white hover:text-gray-300 py-2 font-medium">Accès membre</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800 p-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white text-xl mr-12 hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">UniTeam</Link>
          </div>
          <div className="md:hidden">
            <NotificationNavbar />
            <button onClick={toggleMenu} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
              Menu
            </button>
          </div>
          <div className="md:hidden">
            <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          </div>
          <div className="hidden md:flex md:items-center">
            {user && (
              <>
                <Link to="/calendar" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Calendrier</Link>
                <Link to="/member/schedule" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Mon agenda</Link>
                <NotificationNavbar />
              </>
            )}
            {user?.is_admin && (
              <Link to="/admin/schedule" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Administration</Link>
            )}
            {user && (
              <>
                <Link to="/" onClick={logout} className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Déconnexion</Link>
                <div className="text-white hover:text-gray-300 px-3 py-2 ml-10 rounded-md text-sm font-medium">Bienvenue, {user.firstName} {user.lastName} !</div>
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
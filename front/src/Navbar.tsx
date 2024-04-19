import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Login } from './Login';

export const Navbar: React.FC = () => {
    return (
        <Router>
        <div>
          <nav className="bg-gray-800 p-2 min-h-max">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="text-white text-xl mr-12 hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Hackaton App</Link>
                </div>
                <div>
                  <Link to="/auth" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Accès membre</Link>
                </div>
              </div>
            </div>
          </nav>
  
          <Routes>
            <Route path="/auth" Component={Login as React.ComponentType} />
          </Routes>
        </div>
      </Router>
    );
};
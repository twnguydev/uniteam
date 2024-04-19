import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Login } from './Login';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <Link to="/" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                <Link to="/about" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">About</Link>
                <Link to="/contact" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
              </div>
              <div>
                <Link to="/auth" className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
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

export default App;

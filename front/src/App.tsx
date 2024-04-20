import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Error } from './components/Error';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Calendar } from './components/Calendar';
import { Schedule } from './components/Schedule';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <div>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" Component={Home as React.ComponentType} />
              <Route path="/auth" Component={Login as React.ComponentType} />
              <Route path="*" Component={Error as React.ComponentType} />
              <Route path="/calendar" Component={Calendar as React.ComponentType} />
              <Route path="/admin/schedule" Component={Schedule as React.ComponentType} />
              <Route path="/member/:id/schedule" Component={Schedule as React.ComponentType} />
            </Routes>
          </AuthProvider>
        </div>
      </Router>
      <Footer />
    </>
  );
};

export default App;

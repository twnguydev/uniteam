import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Footer />
    </>
  );
};

export default App;

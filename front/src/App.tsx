import React from 'react';
import { PageRouter } from './router/Routes';
import { Footer } from './components/Footer';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <>
      <PageRouter />
      <Footer />
    </>
  );
};

export default App;
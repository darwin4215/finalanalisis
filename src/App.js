import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import LoginPage from './LoginPage';
import HomePage from './views/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} /> {/* Página de inicio */}
      </Routes>
    </Router>
  );
}

export default App;

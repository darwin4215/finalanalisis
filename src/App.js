import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import LoginPage from './LoginPage';
import HomePage from './views/HomePage';
import ReportPage from './views/reportPage';
import StillReport from './views/stillreport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} /> 
        <Route path="/reportPage" element={<ReportPage />} />
        <Route path='/stillReport' element={<StillReport />} />
      </Routes>
    </Router>
    
  );
}

export default App;

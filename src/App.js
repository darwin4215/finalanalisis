import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import './App.css';
import LoginPage from './LoginPage';
import HomePage from './views/HomePage';
import ReportPage from './views/reportPage';
import StillReport from './views/stillreport';
import BandReports from './views/bandreports';
import TaskTech from './views/tasktech'; 
// Ajusta el nombre a "bandreports.js"
 // Asegúrate de que el archivo y ruta sean correctos

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/homepage" element={<HomePage />} /> 
        <Route path="/reportPage" element={<ReportPage />} />
        <Route path="/stillReport" element={<StillReport />} />
        <Route path="/bandReports" element={<BandReports />} /> {/* Nueva ruta para BandReports */}
        <Route path="/tasktech" element={<TaskTech />} />
      </Routes>
    </Router>
  );
}

export default App;

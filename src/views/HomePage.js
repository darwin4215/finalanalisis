import React from 'react';
import { useLocation, useNavigate  } from 'react-router-dom';
import ChatBox from "./ChatBox";
import '../App.css';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = location.state?.role || sessionStorage.getItem('userRole'); // Obtener el rol desde el estado o sessionStorage



  return (
    <div className="app">
      <header className="app-header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item-inicio">Inicio</li>
            <li className="nav-item-soporte">Soporte</li>
            <li className="nav-item-faq">Preguntas Frecuentes</li>
          </ul>
        </nav>
        <div className="language-selector">
          <select className="language-select">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>

      <main className="main-content">
        <section className="welcome-section">
          <h1 className="welcome-title">¡Bienvenido!</h1>
          <p className="welcome-text">
            Explora y domina: El <span className="highlight">arte</span> de utilizar <span className="highlight">AXPA&D</span>.
          </p>
          <p className="welcome-subtext"><b>Aprende, aplica y triunfa.</b></p>
          <button className="start-button">¡COMENCEMOS!</button>
        </section>

        <section className="cards-section">
          {/* Siempre mostrar estas 2 cards para cualquier tipo de usuario */}
          <div className="card card-reach" onClick={() => navigate('/reportPage')} >
            <h3>Crear Reporte</h3>
          </div>
          <div className="card card-conversations" onClick={() => navigate('/stillreport')}>
            <h3>Seguimiento de Reporte</h3>
          </div>

          {/* Solo mostrar estas cards si el usuario es admin */}
          {userRole === 'admin' && (
            <>
              <div className="card card-conversations" onClick={() => navigate('/bandreports')}>
                <h3>Bandeja Reportes</h3>
              </div>
              <div className="card card-conversations" onClick={() => navigate('/pamientras')}>
                <h3>Chat WhatsApp</h3>
              </div>
            </>
          )}
          {userRole === 'Tecnico' && (
            <>
              <div className="card card-conversations" onClick={() => navigate('/tasktech')}>
                <h3>Mis Tareas</h3>
              </div>
            </>
          )}
        </section>
      </main>

      <ChatBox />
    </div>
  );
}

export default HomePage;

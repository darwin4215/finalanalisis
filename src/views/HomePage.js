import React from 'react';
import '../App.css';

function HomePage() {
  return (
    <div className="app">
      <header className="app-header">
        <img src="/logo.png" alt="Logo" className="logo" />
        <nav className="navigation">
          <ul className="nav-list">
            <li className="nav-item-inicio">Inicio</li>
            <li className="nav-item-soporte">Soporte</li>
            <li className="nav-item-faq">Preguntas Frecuentes</li>
            <li className="nav-item-reach">Reach</li>
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
          <p className="welcome-text">Explora y domina: El <span className="highlight">arte</span> de utilizar <span className="highlight">Reach</span>.</p>
          <p className="welcome-subtext"><b>Aprende, aplica y triunfa.</b></p>
          <button className="start-button">¡COMENCEMOS!</button>
        </section>
        <section className="cards-section">
          <div className="card card-reach">
            <h3>Reach</h3>
          </div>
          <div className="card card-conversations">
            <h3>Conversaciones</h3>
          </div>
          <div className="card card-orders">
            <h3>Órdenes</h3>
          </div>
          <div className="card card-campaigns">
            <h3>Campañas</h3>
          </div>
          <div className="card card-settings">
            <h3>Configuración</h3>
          </div>
          <div className="card card-reports">
            <h3>Reportes</h3>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;

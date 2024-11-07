import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './views.css'; // Importar los estilos

const StillReport = () => {
  const [reports, setReports] = useState([]);
  
  useEffect(() => {
    document.body.classList.add('still-report-background');
    return () => document.body.classList.remove('still-report-background');
  }, []);
  
  useEffect(() => {
    const fetchReports = async () => {
      const userId = sessionStorage.getItem('userId'); // Obtener el UsuarioId del sessionStorage

      if (!userId) {
        console.error('userId no está definido');
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/getReportes', {
          params: { userId }  // Enviar el userId al backend
        });
        setReports(response.data); // Almacenar los datos en el estado
      } catch (error) {
        console.error('Error al obtener los reportes:', error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1 className="report-header">Mis Tickets</h1>
      <div className="report-container">
        {reports.map((report) => (
          <div key={report.Id} className="ticket-card">
            <div className="ticket-header">
              Ticket #{report.Id}
            </div>
            <div className="ticket-body">
              <div className="ticket-info">
                <span>Descripción:</span> {report.DescripcionProblema}
              </div>
              <div className="ticket-info">
                <span>Tipo de Problema:</span> {report.TipoProblema}
              </div>
              <div className="ticket-info">
                <span>Fecha del Incidente:</span> {new Date(report.FechaIncidente).toLocaleString()}
              </div>
              <div className="ticket-info">
                <span>Frecuencia:</span> {report.Frecuencia}
              </div>
              <div className="ticket-info">
                <span>Fecha del Reporte:</span> {new Date(report.FechaReporte).toLocaleString()}
              </div>
              <div className="ticket-info">
                <span>Cliente:</span> {report.UserName}
              </div>
            </div>
            <div className={`ticket-status ${report.Status.toLowerCase()}`}>
              {report.Status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StillReport;

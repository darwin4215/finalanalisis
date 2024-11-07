import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './views.css'; // Importar los estilos

const BandReport = () => {
  const [reports, setReports] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const userId = sessionStorage.getItem('userId'); 

  useEffect(() => {
    document.body.classList.add('band-report-background');
    return () => document.body.classList.remove('band-report-background');
  }, []);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getTicket');
        setReports(response.data);
      } catch (error) {
        console.error('Error al obtener los reportes:', error);
      }
    };

    fetchReports();
  }, []);

  const handleAssign = async (ticketId) => {
    try {
      if (selectedTicketId === ticketId) {
        setSelectedTicketId(null);
      } else {
        const response = await axios.get('http://localhost:3001/getTechnicians');
        setTechnicians(response.data);
        setSelectedTicketId(ticketId);
      }
    } catch (error) {
      console.error('Error al obtener los técnicos:', error);
    }
  };

  const handleTechnicianSelect = async (ticketId, technicianId) => {
    console.log("Datos enviados al backend:", { ticketId, technicianId:userId }); // Verificar datos
  
    try {
      const response = await axios.post('http://localhost:3001/assignTechnicianToTask', {
        ticketId,
        technicianId:userId
      });
      console.log("Respuesta del servidor:", response); // Imprimir respuesta del servidor
      setSelectedTicketId(null); // Ocultar la lista de técnicos después de la asignación
      alert("Técnico asignado a la tarea exitosamente");
    } catch (error) {
      console.error('Error al asignar el técnico a la tarea:', error);
      alert("Error al asignar el técnico a la tarea");
    }
  };
  

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await axios.post(`http://localhost:3001/updateStatus`, {
        ticketId,
        status: newStatus,
      });
      // Actualizar el estado de los reportes localmente
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.Id === ticketId ? { ...report, Status: newStatus } : report
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  return (
    <div>
      <h1 className="report-header">Todos los Tickets</h1>
      <div className="report-container">
        {reports.map((report) => (
          <div key={report.Id} className="ticket-card">
            <div className="ticket-header">
              Ticket #{report.Id}
              <select
                className="status-select"
                onChange={(e) => handleStatusChange(report.Id, e.target.value)}
                defaultValue="" // Para que no muestre un valor inicial
              >
                <option value="" disabled>Actualizar estado</option>
                <option value="Visto">Visto</option>
                <option value="Solventado">Solventado</option>
                <option value="Pendiente">Pendiente</option>
              </select>
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
            <button className="assign-button" onClick={() => handleAssign(report.Id)}>
              Asignar
            </button>

            {selectedTicketId === report.Id && (
              <div className="technician-list">
                <h3>Seleccionar Técnico:</h3>
                <ul>
                  {technicians.map((tech) => (
                    <li
                      key={tech.id}
                      className="technician-item"
                      onClick={() => handleTechnicianSelect(report.Id, tech.id)}
                    >
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandReport;

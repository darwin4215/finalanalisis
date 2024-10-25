import React, { useEffect, useState } from 'react';
import './views.css'; // Importa el archivo CSS

const BandReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technicians, setTechnicians] = useState([]); // Lista de técnicos
  const [showTechnicians, setShowTechnicians] = useState(null); // Controla si se muestra el selector de técnicos para un ticket específico

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:3001/getTicket');
        
        if (!response.ok) {
          throw new Error('Error al obtener los reportes');
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const response = await fetch('http://localhost:3001/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado');
      }

      const data = await response.json();
      console.log(data.message);

      setReports((prevReports) =>
        prevReports.map((report) =>
          report.Id === ticketId ? { ...report, Status: newStatus } : report
        )
      );
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'status-pendiente';
      case 'En Progreso':
        return 'status-en-progreso';
      case 'Solventado':
        return 'status-solventado';
      default:
        return '';
    }
  };

  // Función para manejar el clic en "Asignar"
  const handleAssignClick = async (ticketId) => {
    try {
      const response = await fetch('http://localhost:3001/getTechnicians');
      
      if (!response.ok) {
        throw new Error('Error al obtener técnicos');
      }

      const data = await response.json();
      setTechnicians(data); // Guarda los técnicos en el estado
      setShowTechnicians(ticketId); // Muestra el selector para el ticket específico
    } catch (error) {
      console.error('Error al obtener técnicos:', error);
    }
  };

  // Función para manejar la selección de un técnico y asignar el ticket
  const handleTechnicianSelect = async (technicianId, ticketId) => {
    try {
      // Guardar el ID del técnico en localStorage (opcional)
      localStorage.setItem('selectedTechnician', technicianId);

      // Hacer la solicitud para asignar el técnico al ticket
      const response = await fetch('http://localhost:3001/assignTechnicianToTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ technicianId, ticketId }),
      });

      if (!response.ok) {
        throw new Error('Error al asignar el técnico');
      }

      const data = await response.json();
      console.log(data.message); // Mostrar mensaje de éxito en la consola
      alert(`Técnico asignado exitosamente: ${data.message}`);

      // Ocultar el selector después de la asignación
      setShowTechnicians(null);
    } catch (error) {
      console.error('Error al asignar el técnico:', error);
    }
  };

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 className="centered-title">Lista de Reportes</h2>
      <ul className="report-list">
        {reports.map((report) => (
          <li key={report.Id} className="report-item">
            <p className="report-title">Ticket #{report.Id}</p>

            <select
              className="report-select"
              value={report.Status}
              onChange={(e) => handleStatusChange(report.Id, e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">Visto</option>
              <option value="Solventado">Solventado</option>
            </select>

            <p><strong>Descripción:</strong> {report.DescripcionProblema}</p>
            <p><strong>Tipo de Problema:</strong> {report.TipoProblema}</p>
            <p><strong>Fecha del Incidente:</strong> {report.FechaIncidente}</p>
            <p><strong>Frecuencia:</strong> {report.Frecuencia}</p>
            <p><strong>Cliente:</strong> {report.UserName}</p>

            <p className={`report-status ${getStatusClass(report.Status)}`}>
              {report.Status}
            </p>

            {/* Botón Asignar */}
            <button className="assign-button" onClick={() => handleAssignClick(report.Id)}>
              Asignar
            </button>

            {/* Mostrar lista de técnicos si se presiona "Asignar" para este ticket */}
            {showTechnicians === report.Id && (
              <div className="technician-list">
                <p>Seleccionar Técnico:</p>
                <ul>
                  {technicians.map((tech) => (
                    <li key={tech.ID} onClick={() => handleTechnicianSelect(tech.ID, report.Id)}>
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BandReports;

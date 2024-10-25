/*here is the form page*/ 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './views.css'; // Importar los estilos

const ReportPage = () => {
  const [formData, setFormData] = useState({
    usuarioId: '', 
    numeroCuenta: '',
    tipoServicio: 'Internet',
    descripcionProblema: '',
    tipoProblema: '',
    fechaIncidente: '',
    frecuencia: '',
    dispositivosAfectados: '',
    reinicioModem: '',
    pasosTomados: '',
    metodoContacto: '',
    horarioContacto: '',
  });
  useEffect(() => {
    document.body.classList.add('report-page-background');
    return () => document.body.classList.remove('report-page-background');
  }, []);
  
    // Obtener el usuarioId desde sessionStorage cuando se carga la página
    useEffect(() => {
      const storedUserId = sessionStorage.getItem('userId');
      if (storedUserId) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          usuarioId: storedUserId  // Asignar el ID del usuario al formulario
        }));
      }
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/submitReport', formData);
      console.log('Respuesta del servidor:', response.data);
      alert('Reporte enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      alert('Hubo un error al enviar el reporte');
    }
  };

  return (
    <div className="report-page">
      <h1 className="title">Reporte de Problemas de Servicio</h1>
      <form onSubmit={handleSubmit} className="report-form">
        
        <div className="form-group">
          <label className="form-label">Número de Cuenta:</label>
          <input
            type="text"
            name="numeroCuenta"
            className="form-input"
            value={formData.numeroCuenta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Servicio:</label>
          <select
            name="tipoServicio"
            className="form-select"
            value={formData.tipoServicio}
            onChange={handleChange}
            required
          >
            <option value="Internet">Internet</option>
            <option value="TV">TV</option>
            <option value="Teléfono">Teléfono</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción del Problema:</label>
          <textarea
            name="descripcionProblema"
            className="form-textarea"
            value={formData.descripcionProblema}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tipo de Problema:</label>
          <select
            name="tipoProblema"
            className="form-select"
            value={formData.tipoProblema}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Conexión lenta">Conexión lenta</option>
            <option value="Corte total del servicio">Corte total del servicio</option>
            <option value="Problemas con el router">Problemas con el router</option>
            <option value="Facturación">Problemas de facturación</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fecha y Hora del Incidente:</label>
          <input
            type="datetime-local"
            name="fechaIncidente"
            className="form-input"
            value={formData.fechaIncidente}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Frecuencia del Problema:</label>
          <select
            name="frecuencia"
            className="form-select"
            value={formData.frecuencia}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Constante">Constante</option>
            <option value="Intermitente">Intermitente</option>
            <option value="Ocurrió una vez">Ocurrió una vez</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Dispositivos Afectados:</label>
          <input
            type="text"
            name="dispositivosAfectados"
            className="form-input"
            value={formData.dispositivosAfectados}
            onChange={handleChange}
            placeholder="Ej: Laptop, Móvil, Tablet"
          />
        </div>

        <div className="form-group">
          <label className="form-label">¿Reinició el modem o router?</label>
          <select
            name="reinicioModem"
            className="form-select"
            value={formData.reinicioModem}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Sí">Sí</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">¿Qué pasos ha tomado para resolver el problema?</label>
          <textarea
            name="pasosTomados"
            className="form-textarea"
            value={formData.pasosTomados}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Preferencia de Contacto:</label>
          <select
            name="metodoContacto"
            className="form-select"
            value={formData.metodoContacto}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione</option>
            <option value="Correo">Correo</option>
            <option value="Teléfono">Teléfono</option>
            <option value="Chat">Chat</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mejor horario para contactarle:</label>
          <input
            type="text"
            name="horarioContacto"
            className="form-input"
            value={formData.horarioContacto}
            onChange={handleChange}
            placeholder="Ej: 9am - 12pm"
          />
        </div>

        <button type="submit" className="submit-button">Enviar Reporte</button>
      </form>
    </div>
  );
};

export default ReportPage;

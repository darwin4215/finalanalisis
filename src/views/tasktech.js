import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './views.css'; 

const TaskTech = () => {
    const [tasks, setTasks] = useState([]);
    
    // Recuperar el userId del sessionStorage
    const userId = sessionStorage.getItem('userId'); 

    useEffect(() => {
        if (userId) {  // Verificar que userId no sea null
            const fetchTasks = async () => {
                try {
                    const response = await axios.get('http://localhost:3001/getTechnicalTasks', {
                        params: { userId }
                    });
                    setTasks(response.data);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            };

            fetchTasks();
        } else {
            console.error('No se encontró un userId en sessionStorage');
        }
    }, [userId]);

    return (
        <div>
            <h2>Tareas Técnicas Asignadas</h2>
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task.ticket_id} className="ticket-card">
                        <h3>Ticket #{task.ticket_id}</h3>
                        <p><strong>Descripción:</strong> {task.DescripcionProblema}</p>
                        <p><strong>Tipo de problema:</strong> {task.TipoProblema}</p>
                        <p><strong>Fecha del Incidente:</strong> {task.FechaIncidente}</p>
                        <p><strong>Frecuencia:</strong> {task.Frecuencia}</p>
                        <p><strong>Status:</strong> {task.Status}</p>
                        <p><strong>Fecha de Asignación:</strong> {task.assigned_date}</p>
                    </div>
                ))
            ) : (
                <p>No hay tareas asignadas para este usuario.</p>
            )}
        </div>
    );
};

export default TaskTech;

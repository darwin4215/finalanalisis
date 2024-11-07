const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');  // Para hacer la petición a la API de reCAPTCHA

const app = express();
const port = 3001;

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.json());

// Habilitar CORS (opcional)
app.use(cors());

// Configuración de conexión a SQL Server
const config = {
    user: 'sa',
    password: 'sa123',
    server: 'localhost',
    database: 'pfinalas',
    options: {
        encrypt: false,
        trustServerCertificate: false
    }
};

// Clave secreta de reCAPTCHA
const RECAPTCHA_SECRET_KEY = '6LddtmIqAAAAAH2KhxkkK8VWJjojEspMhd7KEpa1';

// Función para validar el token de reCAPTCHA
async function verifyCaptcha(token) {
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: RECAPTCHA_SECRET_KEY,
                response: token
            }
        });

        return response.data.success;  // Devuelve true si el CAPTCHA es válido
    } catch (err) {
        console.error('Error al verificar reCAPTCHA:', err);
        return false;  // En caso de error, asume que el CAPTCHA no es válido
    }
}

// Función para validar usuario y contraseña
async function authenticateUser(username, password) {
    try {
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            // Asegúrate de seleccionar el campo 'role' aquí
            .query('SELECT ID, UserName, role FROM Usuarios WHERE UserName = @username AND contraseña = @password');

        if (result.recordset.length > 0) {
            return { success: true, user: result.recordset[0] };  // Usuario encontrado con el rol
        } else {
            return { success: false, message: 'Usuario o contraseña incorrectos' };  // No encontrado
        }
    } catch (err) {
        console.error('Error al autenticar usuario:', err);
        return { success: false, message: 'Error en la autenticación' };
    }
}

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
    const { username, password, captchaValue } = req.body;

    // Verificar el CAPTCHA antes de autenticar al usuario
    const isCaptchaValid = await verifyCaptcha(captchaValue);


    // Si el CAPTCHA es válido, procedemos a la autenticación del usuario
    const authResult = await authenticateUser(username, password);

    if (authResult.success) {
        res.json({ message: 'Inicio de sesión exitoso', user: authResult.user });
    } else {
        res.status(401).json({ message: authResult.message });
    }
});

// Ruta para recibir y almacenar los datos del formulario de reportes
app.post('/submitReport', async (req, res) => {
    const {
        usuarioId,
        numeroCuenta,
        tipoServicio,
        descripcionProblema,
        tipoProblema,
        fechaIncidente,
        frecuencia,
        dispositivosAfectados,
        reinicioModem,
        pasosTomados,
        metodoContacto,
        horarioContacto
    } = req.body;

    try {
        // Conectar a la base de datos
        let pool = await sql.connect(config);

        // Insertar los datos en la tabla 'Reportes'
        await pool.request()
            .input('usuarioId', sql.Int, usuarioId)
            .input('numeroCuenta', sql.VarChar, numeroCuenta)
            .input('tipoServicio', sql.VarChar, tipoServicio)
            .input('descripcionProblema', sql.VarChar, descripcionProblema)
            .input('tipoProblema', sql.VarChar, tipoProblema)
            .input('fechaIncidente', sql.DateTime, fechaIncidente)
            .input('frecuencia', sql.VarChar, frecuencia)
            .input('dispositivosAfectados', sql.VarChar, dispositivosAfectados)
            .input('reinicioModem', sql.Bit, reinicioModem)
            .input('pasosTomados', sql.VarChar, pasosTomados)
            .input('metodoContacto', sql.VarChar, metodoContacto)
            .input('horarioContacto', sql.VarChar, horarioContacto)
            .query(`
                INSERT INTO Reportes (UsuarioId, NumeroCuenta, TipoServicio, DescripcionProblema, TipoProblema, FechaIncidente, Frecuencia, DispositivosAfectados, ReinicioModem, PasosTomados, MetodoContacto, HorarioContacto)
                VALUES (@usuarioId, @numeroCuenta, @tipoServicio, @descripcionProblema, @tipoProblema, @fechaIncidente, @frecuencia, @dispositivosAfectados, @reinicioModem, @pasosTomados, @metodoContacto, @horarioContacto)
            `);

        // Si la inserción es exitosa, enviamos una respuesta
        res.status(200).json({ message: 'Reporte guardado exitosamente' });
    } catch (err) {
        console.error('Error al insertar el reporte:', err);
        res.status(500).json({ message: 'Error al guardar el reporte' });
    }
});

app.get('/getReportes', async (req, res) => {
    const { userId } = req.query;  // Obtener el userId de los parámetros de la solicitud
  
    // Verificar que userId sea un número válido
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ error: 'userId inválido' });
    }
  
    try {
      let pool = await sql.connect(config);
      
      // Filtrar los reportes por el UsuarioId
      let result = await pool.request()
        .input('userId', sql.Int, userId)  // Filtrar por UsuarioId
        .query(`
          SELECT 
            R.Id,
            R.DescripcionProblema,
            R.TipoProblema,
            R.FechaIncidente,
            R.Frecuencia,
            R.FechaReporte,
            R.Status,
            U.UserName
          FROM 
            Reportes R
          INNER JOIN 
            Usuarios U
          ON 
            R.UsuarioId = U.Id
          WHERE 
            R.UsuarioId = @userId;  
        `);
  
      // Devuelve los resultados al frontend
      res.json(result.recordset);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      res.status(500).json({ error: 'Error al obtener los reportes' });
    }
  });
  
/*funcion para obtener todos los reportes sin restriccion de ID*/
  app.get('/getTicket', async (req, res) => {
    const { userId } = req.query;  // Obtener el userId de los parámetros de la solicitud, si está presente
  
    try {
      let pool = await sql.connect(config);
  
      // Construir la consulta SQL con o sin filtro por userId
      let query = `
        SELECT 
          R.Id,
          R.DescripcionProblema,
          R.TipoProblema,
          R.FechaIncidente,
          R.Frecuencia,
          R.FechaReporte,
          R.Status,
          U.UserName
        FROM 
          Reportes R
        INNER JOIN 
          Usuarios U
        ON 
          R.UsuarioId = U.Id
      `;
  
      // Agregar filtro si userId está presente en la solicitud
      if (userId && !isNaN(userId)) {
        query += ` WHERE R.UsuarioId = @userId`;
      }
  
      let request = pool.request();
      
      // Si hay un userId válido, se agrega como parámetro de entrada
      if (userId && !isNaN(userId)) {
        request.input('userId', sql.Int, userId);
      }
  
      // Ejecutar la consulta
      let result = await request.query(query);
  
      // Devolver los resultados al frontend
      res.json(result.recordset);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
      res.status(500).json({ error: 'Error al obtener los reportes' });
    }
  });
  

  /*funcion para mostrar la lista de tecnicos dentro del ticket */
  app.get('/getTechnicians', async (req, res) => {
    try {
      // Conectar a la base de datos
      let pool = await sql.connect(config);
  
      // Ejecutar la consulta para obtener los usuarios con rol de Técnico
      let result = await pool.request().query(`
        SELECT ID, UserName AS name
        FROM Usuarios
        WHERE role = 'Tecnico'
      `);
  
      // Devolver la lista de técnicos al frontend
      res.json(result.recordset);
    } catch (error) {
      console.error('Error al obtener técnicos:', error);
      res.status(500).json({ error: 'Error al obtener técnicos' });
    }
  });

/*actualizar estados del ticket */
app.post('/updateStatus', async (req, res) => {
  const { ticketId, status } = req.body;

  try {
    let pool = await sql.connect(config);
    await pool.request()
      .input('ticketId', sql.Int, ticketId)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE Reportes
        SET Status = @status
        WHERE Id = @ticketId
      `);

    res.status(200).json({ message: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
});


/*funciono para hacer la asignacion de tickets a tecnicos */
app.post('/assignTechnicianToTask', async (req, res) => {
    const { technicianId, ticketId } = req.body;
  
    // Validar que technicianId y ticketId no sean nulos
    if (!technicianId || !ticketId) {
      return res.status(400).json({ error: 'technical_id y ticket_id son requeridos' });
    }
  
    try {
      let pool = await sql.connect(config);
  
      await pool.request()
        .input('technical_id', sql.Int, technicianId)
        .input('ticket_id', sql.Int, ticketId)
        .query(`
          INSERT INTO TechnicalTask (technical_id, ticket_id)
          VALUES (@technical_id, @ticket_id)
        `);
  
      res.status(200).json({ message: 'Técnico asignado a la tarea exitosamente' });
    } catch (error) {
      console.error('Error al asignar el técnico a la tarea:', error);
      res.status(500).json({ error: 'Error al asignar el técnico a la tarea' });
    }
  });
  
  /*funcnion para que los tecnicos miren los tickets asignados */
  app.get('/getTechnicalTasks', async (req, res) => {
    const { userId } = req.query; // Obtener el userId de los parámetros de la solicitud

    // Verificar que userId sea un número válido
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'userId inválido' });
    }

    try {
        let pool = await sql.connect(config);
        
        // Consulta para obtener los datos de TechnicalTask con la información adicional requerida
        let result = await pool.request()
            .input('userId', sql.Int, userId)  // Filtrar por UsuarioId
            .query(`
                SELECT 
                    TT.ticket_id,
                    TT.assigned_date,
                    R.DescripcionProblema,
                    R.TipoProblema,
                    R.FechaIncidente,
                    R.Frecuencia,
                    R.Status,
                    U.UserName
                FROM 
                    TechnicalTask TT
                INNER JOIN 
                    Reportes R ON TT.ticket_id = R.Id
                INNER JOIN 
                    Usuarios U ON TT.technical_id = U.Id
                WHERE 
                    TT.technical_id = @userId; 
            `);

        // Devuelve los resultados al frontend
        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener las tareas técnicas:', error);
        res.status(500).json({ error: 'Error al obtener las tareas técnicas' });
    }
});

  
// Iniciar el servidor en el puerto 3001
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

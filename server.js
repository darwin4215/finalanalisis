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

// Iniciar el servidor en el puerto 3001
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

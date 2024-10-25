import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom'; 
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState(null); // Estado para almacenar el valor del CAPTCHA
  const navigate = useNavigate();

  // Función para manejar el cambio en el CAPTCHA
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  // Función para manejar el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault();

    // Verificar si el CAPTCHA fue completado
    if (!captchaValue) {
      setLoginMessage('Por favor, completa el CAPTCHA');
      return;
    }

    // Realiza la petición POST a la API de inicio de sesión
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, captchaValue }), // Enviar también el valor del CAPTCHA
      });

      const data = await response.json();

      if (response.ok) {
        // Almacenar el rol del usuario y redirigir a la página principal
        setLoginMessage(`Inicio de sesión exitoso, bienvenido ${data.user.UserName}`);

        // Aquí guardamos el rol del usuario en sessionStorage o localStorage (según prefieras)
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('userId', data.user.ID);

        setLoginMessage(`Inicio de sesión exitoso, bienvenido ${data.user.UserName}`);

        // Redirigir a la página de inicio, puedes cambiar esta ruta según tu configuración de rutas
        navigate('/homepage', { state: { role: data.user.role } });
      } else {
        setLoginMessage(data.message);
      }
    } catch (error) {
      setLoginMessage('Error en el servidor. Inténtalo más tarde.');
    }
  };

  return (
    <div className="login-page-unique">
      <div className="left-section-unique">
        <h1 className="welcome-text-unique">Welcome Back To EXPA&D</h1>
        <p className="welcome-description-unique">
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout. The point of using.
        </p>
        <div className="social-icons-unique">
          <i className="fab fa-facebook-f"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-youtube"></i>
        </div>
      </div>

      <div className="right-section-unique">
        <h2 className="signin-title-unique">Sign in</h2>
        <form className="signin-form-unique" onSubmit={handleLogin}>
          <input
            className="email-input-unique"
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="password-input-unique"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Integración de reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6LddtmIqAAAAAH2KhxkkK8VWJjojEspMhd7KEpa1" 
            onChange={handleCaptchaChange}
          />

          <button className="signin-button-unique" type="submit">Sign in now</button>
          <button className="create-account-button-unique" type="button">Create An Account</button>
        </form>

        {loginMessage && <p className="login-message">{loginMessage}</p>}
        <a className="lost-password-link-unique" href="#">Lost your password?</a>
        <p className="terms-unique">
          By clicking on "Sign in now" you agree to our <a className="terms-link-unique" href="#">Terms of Service</a> and <a className="privacy-link-unique" href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

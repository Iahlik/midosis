import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Se ejecuta solo la primera vez para verificar si ya hay una sesión activa
    checkLoggedInStatus();
  }, []);

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    console.log('Datos de inicio de sesión:', email, password);
    if (!email.trim() || !password.trim()) {
      setError('Los datos ingresados no son válidos.');
      return;
    }

    setError('');
    const userData = { email, password };

    try {
      const response = await fetch(`http://localhost:3000/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();

        if (action === 'login') {
          setIsLoggedIn(true);
          setToken(data.token);
          fetchUserData();
          // Redirige al perfil de usuario después del inicio de sesión exitoso
          navigate('/perfil-usuario');  // Ajusta la ruta según tu configuración
        }
        setEmail('');
        setPassword('');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage || 'Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error al realizar el registro o inicio de sesión');
    }
  };

  const checkLoggedInStatus = async () => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchUserData();
    }
  };

  const setIsLoggedInFalse = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  const handleLogout = () => {
    setIsLoggedInFalse();
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
    }
  };

  const fetchMedicamentos = async (userId, authToken) => {
    try {
      const response = await fetch(`http://localhost:3000/medicamentos/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener medicamentos');
      }

      const data = await response.json();
      console.log('Medicamentos:', data);
      return data;
    } catch (error) {
      console.error('Error al obtener medicamentos:', error);
      throw error;
    }
  };

  const authContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    setIsLoggedInFalse,
    error,
    email,
    setEmail,
    user,
    password,
    setPassword,
    handleSubmit,
    handleLogout,
    fetchMedicamentos,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return authContext;
};

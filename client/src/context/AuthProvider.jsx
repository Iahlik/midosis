import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Solo se ejecuta la primera vez para verificar si ya hay una sesión activa
    checkLoggedInStatus();
  }, []);

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Los datos ingresados no son válidos.');
      return;
    }

    setError('');
    setIsRegistered(action === 'register');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (action === 'register') {
          setIsRegistered(true);
        } else {
          setIsLoggedIn(true);
          setToken(data.token);
          fetchUsers(); // Obtén la información del usuario al iniciar sesión
        }

        setEmail('');
        setPassword('');
      } else {
        const errorMessage = await response.text(); // Obtén el mensaje de error del servidor
        setError(errorMessage || 'Credenciales de inicio de sesión incorrectas');
      }
    } catch (error) {
      setError('Error al realizar el registro o inicio de sesión');
    }
  };

  const checkLoggedInStatus = async () => {
    // Verificar si ya hay una sesión activa (por ejemplo, si hay un token almacenado en localStorage)
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchUsers();
    }
  };

  const setIsLoggedInFalse = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };
  
  const handleLogout = () => {
    setIsLoggedInFalse();
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/usuarios', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener la lista de usuarios');
      }

      const data = await response.json();
      setUser(data[0]);
      setIsLoggedIn(true); // Puedes ajustar esto según tu lógica de autenticación
      console.log('User fetched successfully:', data); 
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
    }
  };

  const authContextValue = {
    isLoggedIn,
    setIsLoggedIn,
    setIsLoggedInFalse,
    name,
    setName,
    error,
    email,
    setEmail,
    user,
    setUser,
    password,
    setPassword,
    isRegistered,
    setIsRegistered,
    token,
    handleSubmit,
    handleLogout,
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

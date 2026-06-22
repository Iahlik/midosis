import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Los datos ingresados no son válidos.');
      return;
    }

    setError('');

    try {
      const response = await fetch(`${API_URL}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (action === 'login') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setToken(data.token);
          setUser(data.user);
          setIsLoggedIn(true);
          toast.success('Inicio de sesión exitoso');
          navigate('/perfil-usuario');
        }

        setEmail('');
        setPassword('');
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data.message || 'Credenciales incorrectas';
        setError(msg);
        toast.error(msg);
      }
    } catch {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setToken('');
    toast.success('Cerraste sesión exitosamente');
    navigate('/login');
  };

  const fetchMedicamentos = async (userId, authToken) => {
    const response = await fetch(`${API_URL}/medicamentos/${userId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!response.ok) throw new Error('Error al obtener medicamentos');
    return response.json();
  };

  const deleteMedicamento = async (dosisId) => {
    const response = await fetch(`${API_URL}/medicamentos/${dosisId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Error al eliminar el medicamento');
  };

  const authContextValue = {
    isLoggedIn,
    error,
    email,
    setEmail,
    user,
    password,
    setPassword,
    token,
    handleSubmit,
    handleLogout,
    fetchMedicamentos,
    deleteMedicamento,
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

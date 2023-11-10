
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState();
    const [token, setToken] = useState(null); // Agregamos el estado del token

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e, action) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            setError('Los datos ingresados no son válidos.');
            return;
        }

        setError(false);
        setIsRegistered(action === 'register');

        try {
            const response = await fetch(action === 'register' ? 'https://backend-megalomaniac.onrender.com/usuarios' : 'https://backend-megalomaniac.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (action === 'register') {
                    setIsRegistered(true);
                } else {
                    setIsLoggedIn(true);
                    setToken(data.token); // Establecemos el token en el estado
                }

                setEmail('');
                setPassword('');
                setError('');
            } else {
                setError('Credenciales de inicio de sesión incorrectas');
            }
        } catch (error) {
            setError('Error al realizar el registro o inicio de sesión');
        }
    };

    // Función para establecer isLoggedIn en false
    const setIsLoggedInFalse = () => {
        setIsLoggedIn(false);
        setToken(null); // Limpiamos el token al cerrar sesión
    };

    const handleLogout = () => {
        setIsLoggedInFalse();
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('https://backend-megalomaniac.onrender.com/usuarios');
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de usuarios');
            }
            const data = await response.json();
            setUser(data);
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
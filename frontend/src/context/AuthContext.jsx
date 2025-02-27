import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { authCookies } from '../utils/cookieUtils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifica l'autenticazione usando sia i cookie che localStorage
    useEffect(() => {
        const verifyAuth = async () => {
            setLoading(true);
            // Ottieni il token dal cookie o, se non presente, da localStorage
            const tokenFromCookie = authCookies.getAuthToken();
            const tokenFromStorage = localStorage.getItem('token');
            const token = tokenFromCookie || tokenFromStorage;
            
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get("http://localhost:3000/api/users/profile", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
                
                // Sincronizza il token tra cookie e localStorage se necessario
                if (tokenFromCookie && !tokenFromStorage) {
                    localStorage.setItem('token', tokenFromCookie);
                } else if (!tokenFromCookie && tokenFromStorage) {
                    authCookies.setAuthToken(tokenFromStorage);
                }
            } catch (error) {
                console.error("Errore di autenticazione:", error);
                // In caso di errore, rimuovi il token da entrambi
                authCookies.removeAuthToken();
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyAuth();
    }, []);

    // Funzione di login migliorata
    const login = async (credentials) => {
        try {
            const response = await axios.post("http://localhost:3000/api/users/login", credentials);
            const { token, user } = response.data;
            
            // Salva il token sia nei cookie che nel localStorage per compatibilità
            authCookies.setAuthToken(token);
            localStorage.setItem('token', token);
            setUser(user);
            
            return { success: true, user };
        } catch (error) {
            console.error("Errore di login:", error);
            return { 
                success: false, 
                error: error.response?.data?.message || "Errore durante il login" 
            };
        }
    };

    // Funzione di logout
    const logout = () => {
        authCookies.removeAuthToken();
        localStorage.removeItem('token');
        setUser(null);
    };

    // Funzione di registrazione
    const register = async (userData) => {
        try {
            const response = await axios.post("http://localhost:3000/api/users/register", userData);
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error("Errore di registrazione:", error);
            return { 
                success: false, 
                error: error.response?.data?.message || "Errore durante la registrazione" 
            };
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            loading, 
            login, 
            logout, 
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
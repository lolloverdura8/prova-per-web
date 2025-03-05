import { createContext, useContext, useState, useEffect } from "react";
// Importa le funzioni necessarie da React per creare un contesto e gestire lo stato

import axios from 'axios';
// Importa axios per effettuare richieste HTTP

import { authCookies } from '../utils/cookieUtils';
// Importa le utility per la gestione dei cookie di autenticazione

const AuthContext = createContext();
// Crea un nuovo context per l'autenticazione

export const AuthProvider = ({ children }) => {
    // Componente provider che fornirà lo stato di autenticazione a tutta l'app
    // "children" rappresenta tutti i componenti figli che saranno avvolti da questo provider

    const [user, setUser] = useState(null);
    // Stato per memorizzare i dati dell'utente loggato (null se non autenticato)

    const [loading, setLoading] = useState(true);
    // Stato per tenere traccia del caricamento iniziale (verifica dell'autenticazione)

    // Verifica l'autenticazione usando sia i cookie che localStorage
    useEffect(() => {
        // useEffect si esegue quando il componente viene montato

        const verifyAuth = async () => {
            // Funzione asincrona per verificare l'autenticazione

            setLoading(true);
            // Imposta loading a true mentre verifica l'autenticazione

            // Ottieni il token dal cookie o, se non presente, da localStorage
            const tokenFromCookie = authCookies.getAuthToken();
            const tokenFromStorage = localStorage.getItem('token');
            const token = tokenFromCookie || tokenFromStorage;

            if (!token) {
                // Se non c'è nessun token

                setUser(null);
                // Imposta user a null (non autenticato)

                setLoading(false);
                // Termina il caricamento

                return;
                // Esce dalla funzione
            }

            try {
                // Tenta di verificare il token con il backend

                const response = await axios.get("http://localhost:3000/api/users/profile", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                        // Aggiunge il token all'header Authorization
                    }
                });

                // Trasforma la risposta per includere l'URL dell'avatar
                const userData = response.data;
                if (userData && userData._id) {
                    // Se l'utente ha un avatar, crea l'URL per accedervi
                    userData.avatarUrl = userData._id ?
                        `http://localhost:3000/api/users/avatar/${userData._id}` :
                        null;
                }

                setUser(userData);
                // Imposta user con i dati dell'utente ricevuti dal server

                // Sincronizza il token tra cookie e localStorage se necessario
                if (tokenFromCookie && !tokenFromStorage) {
                    localStorage.setItem('token', tokenFromCookie);
                    // Se il token esiste solo nei cookie, salvalo anche in localStorage
                } else if (!tokenFromCookie && tokenFromStorage) {
                    authCookies.setAuthToken(tokenFromStorage);
                    // Se il token esiste solo in localStorage, salvalo anche nei cookie
                }
            } catch (error) {
                // Se la verifica fallisce (token non valido o scaduto)

                console.error("Errore di autenticazione:", error);
                // Logga l'errore nella console

                // In caso di errore, rimuovi il token da entrambi
                authCookies.removeAuthToken();
                localStorage.removeItem('token');

                setUser(null);
                // Imposta user a null (non autenticato)
            } finally {
                setLoading(false);
                // Termina il caricamento indipendentemente dal risultato
            }
        };

        verifyAuth();
        // Chiama la funzione di verifica
    }, []);
    // Array di dipendenze vuoto significa che useEffect si esegue solo al montaggio del componente

    // Funzione di login migliorata
    const login = async (credentials) => {
        // Funzione per gestire il login degli utenti

        try {
            // Tenta di effettuare il login

            const response = await axios.post("http://localhost:3000/api/users/login", credentials);
            // Invia le credenziali al server

            const { token, user } = response.data;
            // Estrae token e dati utente dalla risposta

            // Aggiungi l'URL dell'avatar ai dati dell'utente
            if (user && user._id) {
                user.avatarUrl = `http://localhost:3000/api/users/avatar/${user._id}`;
            }

            // Salva il token sia nei cookie che nel localStorage per compatibilità
            authCookies.setAuthToken(token);
            localStorage.setItem('token', token);

            setUser(user);
            // Aggiorna lo stato dell'utente

            return { success: true, user };
            // Ritorna successo e dati utente
        } catch (error) {
            // Se il login fallisce

            console.error("Errore di login:", error);
            // Logga l'errore nella console

            return {
                success: false,
                error: error.response?.data?.message || "Errore durante il login"
                // Ritorna il messaggio di errore dal server o un messaggio generico
            };
        }
    };

    // Funzione di logout
    const logout = () => {
        // Funzione per effettuare il logout

        authCookies.removeAuthToken();
        // Rimuove il token dai cookie

        localStorage.removeItem('token');
        // Rimuove il token dal localStorage

        setUser(null);
        // Reimposta l'utente a null (non autenticato)
    };

    // Funzione di registrazione
    const register = async (userData) => {
        // Funzione per registrare un nuovo utente

        try {
            // Tenta di registrare l'utente

            const response = await axios.post("http://localhost:3000/api/users/register", userData);
            // Invia i dati utente al server

            return { success: true, message: response.data.message };
            // Ritorna successo e messaggio di conferma
        } catch (error) {
            // Se la registrazione fallisce

            console.error("Errore di registrazione:", error);
            // Logga l'errore nella console

            return {
                success: false,
                error: error.response?.data?.message || "Errore durante la registrazione"
                // Ritorna il messaggio di errore dal server o un messaggio generico
            };
        }
    };

    // Funzione per aggiornare l'avatar dell'utente
    const uploadAvatar = async (file) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return { success: false, error: "Non autenticato" };

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axios.post(
                'http://localhost:3000/api/users/avatar',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Aggiorna l'utente con i nuovi dati ricevuti, incluso l'URL dell'avatar
            if (response.data && response.data.user) {
                const updatedUser = response.data.user;

                // Aggiungi l'URL dell'avatar
                if (updatedUser._id) {
                    updatedUser.avatarUrl = `http://localhost:3000/api/users/avatar/${updatedUser._id}`;
                }

                setUser(updatedUser);
                return { success: true, user: updatedUser };
            }

            return { success: false, error: "Errore durante l'aggiornamento" };
        } catch (error) {
            console.error("Errore nell'upload dell'avatar:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Errore durante l'upload dell'avatar"
            };
        }
    };

    // Funzione per aggiornare l'utente (ad esempio dopo aver cambiato profilo)
    const updateUserData = async () => {
        // Funzione per aggiornare i dati dell'utente corrente

        try {
            const token = localStorage.getItem('token');
            if (!token) return { success: false, error: "Non autenticato" };

            const response = await axios.get("http://localhost:3000/api/users/profile", {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                const userData = response.data;

                // Aggiungi l'URL dell'avatar
                if (userData._id) {
                    userData.avatarUrl = `http://localhost:3000/api/users/avatar/${userData._id}`;
                }

                setUser(userData);
                return { success: true, user: userData };
            }

            return { success: false, error: "Nessun dato ricevuto" };
        } catch (error) {
            console.error("Errore nell'aggiornamento dati utente:", error);
            return {
                success: false,
                error: error.response?.data?.message || "Errore durante l'aggiornamento dei dati"
            };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,             // Stato dell'utente attuale
            setUser,          // Funzione per modificare l'utente
            loading,          // Stato di caricamento
            login,            // Funzione di login
            logout,           // Funzione di logout
            register,         // Funzione di registrazione
            uploadAvatar,     // Funzione per caricare l'avatar
            updateUserData    // Funzione per aggiornare i dati utente
        }}>
            {children}
            {/* Renderizza tutti i componenti figli avvolti dal provider */}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
// Hook personalizzato per accedere facilmente al contesto di autenticazione da qualsiasi componente
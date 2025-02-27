import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AuthForm from "../components/AuthForm";
import CookieBanner from "../components/CookieBanner";
import { useAuth } from '../context/AuthContext';
import '../styles/LoginPage.css';
import "../styles/Global.css";

// Stile specifico della pagina di login per nascondere le impostazioni
const loginPageStyle = `
  .settings-button, .settings-icon {
    display: none !important;
  }
`;

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const switchForm = () => {
        setIsRegister(!isRegister);
        setError("");
    };

    const handleSubmit = async (formData) => {
        try {
            if (isRegister) {
                // Registrazione utente
                const result = await register(formData);
                
                if (result.success) {
                    alert('Registrazione completata con successo!');
                    setIsRegister(false); // Switch to login form
                } else {
                    setError(result.error || 'Errore durante la registrazione');
                }
            } else {
                // Login utente
                const result = await login(formData);
                
                if (result.success) {
                    navigate('/home');
                } else {
                    setError(result.error || 'Credenziali non valide');
                }
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
            setError('Errore di connessione al server');
        }
    };

    return (
        <>
            {/* Inietta stile CSS per nascondere le icone delle impostazioni */}
            <style>{loginPageStyle}</style>
            
            <div className="login-container">
                <AuthForm 
                    isRegister={isRegister} 
                    onToggle={switchForm} 
                    onSubmit={handleSubmit}
                    error={error} 
                />
                <CookieBanner />
            </div>
        </>
    );
};

export default LoginPage;
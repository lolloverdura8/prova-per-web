import React from "react";
import '../styles/LoginPage.css'
import "../styles/Global.css";
import AuthForm from "../components/AuthForm";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authCookies } from "../utils/cookieUtils";


const LoginPage = () => {

    const [isRegister, setIsRegister] = useState(false)
    // Stato per determinare se mostrare il form di registrazione o login
    // false = mostra il form di login, true = mostra il form di registrazione

    const navigate = useNavigate();
    // Inizializza la funzione di navigazione

    const { login, register } = useAuth();
    // Estrae la funzione setUser dal contesto di autenticazione

    const switchForm = () => {
        // Funzione per passare tra il form di login e registrazione

        setIsRegister(!isRegister)
        // Inverte lo stato isRegister (da login a registrazione o viceversa)
    }

    const handleFormSubmit = async (formData) => {
        // Funzione per gestire l'invio del form di login o registrazione
        // formData contiene i dati inseriti nel form
        try {
            if (isRegister) {
                // Se siamo in modalità registrazione
                const result = await register(formData);
                if (result.success) {
                    // Se la registrazione ha successo, naviga alla pagina principale
                    console.log("Registrazione avvenuta con successo");
                    navigate('/home');
                } else {
                    alert("Errore nella registrazione. Riprova.");
                }
            } else {
                // Se siamo in modalità login
                const result = await login(formData);
                if (result.success) {
                    // Se il login ha successo, naviga alla pagina principale
                    console.log("Login avvenuto con successo");
                    navigate('/home');
                } else {
                    alert("Credenziali non valide. Riprova.");
                }
            }

        } catch (error) {
            console.error("Errore durante il login/registrazione:", error);
            alert("Errore durante il login/registrazione. Controlla le credenziali e riprova.");
        }
    }

    return (
        <div className="login-container">
            {/* Contenitore principale della pagina di login */}

            <AuthForm isRegister={isRegister} onToggle={switchForm} onSubmit={handleFormSubmit} />
            {/* Renderizza il form di autenticazione passando:
                - se è in modalità registrazione o login
                - la funzione per cambiare modalità
                - la funzione per gestire l'invio del form
            */}
        </div>
    );
};

export default LoginPage;
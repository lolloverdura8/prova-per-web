// /src/pages/LoginPage.jsx
import React from "react";
// Importa React per poter utilizzare JSX

import '../styles/LoginPage.css'
// Importa lo stile specifico per la pagina di login

import "../styles/Global.css"; // Importiamo lo stile globale   
// Importa lo stile globale dell'applicazione

import AuthForm from "../components/AuthForm";
// Importa il componente del form di autenticazione

import { useState } from "react";
// Importa l'hook useState per gestire lo stato locale del componente

import { useNavigate } from 'react-router-dom';
// Importa useNavigate per navigare programmaticamente tra le pagine

import { useAuth } from '../context/AuthContext';
// Importa il hook personalizzato per accedere al contesto di autenticazione

const LoginPage = () => {
    // Definizione del componente della pagina di login

    const [isRegister, setIsRegister] = useState(false)
    // Stato per determinare se mostrare il form di registrazione o login
    // false = mostra il form di login, true = mostra il form di registrazione

    const navigate = useNavigate();
    // Inizializza la funzione di navigazione

    const { setUser } = useAuth();
    // Estrae la funzione setUser dal contesto di autenticazione

    const switchForm = () => {
        // Funzione per passare tra il form di login e registrazione

        setIsRegister(!isRegister)
        // Inverte lo stato isRegister (da login a registrazione o viceversa)
    }

    const handleSubmit = async (formData) => {
        // Funzione asincrona per gestire l'invio del form

        const url = isRegister ? '/register' : '/login';
        // Seleziona l'URL corretto in base al tipo di form (registrazione o login)

        try {
            // Tenta di eseguire una richiesta al server

            const response = await fetch(`http://localhost:3000/api/users${url}`, {
                // Esegue una richiesta HTTP all'endpoint appropriato

                method: 'POST',
                // Usa il metodo POST

                headers: {
                    'Content-Type': 'application/json'
                    // Imposta l'header per indicare che il corpo è in formato JSON
                },

                body: JSON.stringify(formData),
                // Converte i dati del form in formato JSON
            });

            const result = await response.json();
            // Attende e converte la risposta in formato JSON

            if (response.ok) {
                // Se la richiesta ha avuto successo

                if (isRegister) {
                    // Se era una registrazione

                    alert('Registrazione completata con successo!');
                    // Mostra un messaggio di successo

                    setIsRegister(false); // Switch to login form
                    // Passa al form di login
                } else {
                    // Se era un login

                    // Store token in localStorage
                    localStorage.setItem('token', result.token);
                    // Salva il token nel localStorage

                    setUser(result.user);
                    // Imposta l'utente nel contesto di autenticazione

                    navigate('/home')
                    // Naviga alla home page
                }
            } else {
                // Se la richiesta non ha avuto successo

                alert(result.message || 'Errore durante l\'operazione');
                // Mostra un messaggio di errore
            }
        } catch (error) {
            // Gestisce eventuali errori durante la richiesta

            console.error('Errore durante la richiesta:', error);
            // Logga l'errore nella console

            alert('Errore di connessione al server');
            // Mostra un messaggio di errore all'utente
        }
    }

    return (
        <div className="login-container">
            {/* Contenitore principale della pagina di login */}

            <AuthForm isRegister={isRegister} onToggle={switchForm} onSubmit={handleSubmit} />
            {/* Renderizza il form di autenticazione passando:
                - se è in modalità registrazione o login
                - la funzione per cambiare modalità
                - la funzione per gestire l'invio del form
            */}
        </div>
    );
};

export default LoginPage;
// Esporta il componente per poterlo utilizzare in altri file
// /src/pages/LoginPage.jsx
import React from "react";
import '../styles/LoginPage.css'
import "../styles/Global.css"; // Importiamo lo stile globale   
import AuthForm from "../components/AuthForm";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false)
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const switchForm = () => {
        setIsRegister(!isRegister)
    }

    const handleSubmit = async (formData) => {
        const url = isRegister ? '/register' : '/login';
        try {
            const response = await fetch(`http://localhost:3000/api/users${url}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                if (isRegister) {
                    alert('Registrazione completata con successo!');
                    setIsRegister(false); // Switch to login form
                } else {
                    // Store token in localStorage
                    localStorage.setItem('token', result.token);
                    setUser(result.user);
                    navigate('/home')
                }
            } else {
                alert(result.message || 'Errore durante l\'operazione');
            }
        } catch (error) {
            console.error('Errore durante la richiesta:', error);
            alert('Errore di connessione al server');
        }
    }

    return (
        <div className="login-container">
            <AuthForm isRegister={isRegister} onToggle={switchForm} onSubmit={handleSubmit} />
        </div>
    );
};

export default LoginPage;
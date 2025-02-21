// /src/pages/LoginPage.jsx
import React from "react";
import "../styles/Global.css"; // Importiamo lo stile globale
import AuthForm from "../components/AuthForm";
import { useState } from "react";

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false)

    const switchForm = () => {
        setIsRegister(!isRegister)
    }

    const hanldeSubmit = async (formData) => {
        const url = isRegister ? '/register' : '/login';
        try {
            const response = await fetch('http://localhost:5173/usersRoutes/' + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

        } catch (error) {
            console.error('Errore durante la richiesta ', error);
        }

    }

    return (
        <div className="login-container">
            <AuthForm isRegister={isRegister} onToggle={switchForm} onSubmit={hanldeSubmit} />
        </div>
    );
};

export default LoginPage;

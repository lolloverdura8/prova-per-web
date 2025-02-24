import React, { useState } from "react";
import "../styles/AuthForm.css";

const AuthForm = ({ isRegister, onToggle, onSubmit }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const username = isRegister ? e.target.username.value : undefined;

        if (isRegister && password !== confirmPassword) {
            setError("Le password non coincidono");
            return;
        }

        setError("");
        try {
            await onSubmit({ email, password, username });
        } catch (err) {
            if (err.message === "User not found") {
                setError("Nessun account trovato per questa email. Registrati.");
            } else if (err.message === "Incorrect password") {
                setError("Password errata. Riprova.");
            } else {
                setError("Errore durante l'autenticazione.");
            }
        }
    };

    return (
        <div className="auth-box">
            <h2>{isRegister ? "Registrazione" : "Login"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Email</label>
                    <input type="email" name="email" required />
                </div>
                {isRegister && (
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" name="username" required />
                    </div>
                )}
                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isRegister && (
                    <div className="input-group">
                        <label>Conferma Password</label>
                        <input
                            type="password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Invia</button>
                <a href="#" className="link-login" onClick={onToggle}>
                    {isRegister ? "Hai già un account? Accedi" : "Registrati"}
                </a>
            </form>
        </div>
    );
};

export default AuthForm;

import React from "react";
import "../styles/AuthForm.css";

const AuthForm = ({ isRegister, onToggle, onSubmit }) => {
    const hanldeSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const username = isRegister ? e.target.username.value : undefined;
        onSubmit({ email, password, username });
    }
    return (
        <div className="auth-box">
            <h2>{isRegister ? "Registrazione" : "Login"}</h2>
            <form onSubmit={hanldeSubmit}>
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
                    <input type="password" name="password" required />
                </div>
                <button type="submit">Invia</button>
                <a href="#" className="link-login" onClick={onToggle}>
                    {isRegister ? "Hai già un account? Accedi" : "Registrati"}
                </a>
            </form>
        </div>
    );
};

export default AuthForm;

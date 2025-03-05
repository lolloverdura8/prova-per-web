import React, { useState } from "react";
// Importa React e l'hook useState

import "../styles/AuthForm.css";
// Importa gli stili CSS per il form di autenticazione

const AuthForm = ({ isRegister, onToggle, onSubmit, error }) => {
    // Definizione del componente AuthForm che accetta diverse props:
    // - isRegister: booleano che indica se mostrare il form di registrazione o login
    // - onToggle: funzione da chiamare quando si vuole passare tra login e registrazione
    // - onSubmit: funzione da chiamare quando il form viene inviato
    // - error: eventuali errori da mostrare

    const [password, setPassword] = useState("");
    // Stato per memorizzare la password inserita

    const [confirmPassword, setConfirmPassword] = useState("");
    // Stato per memorizzare la conferma della password (per la registrazione)

    const [formError, setFormError] = useState("");
    // Stato per memorizzare errori specifici del form

    const handleSubmit = async (e) => {
        // Funzione per gestire l'invio del form

        e.preventDefault();
        // Previene il comportamento predefinito di invio del form

        const email = e.target.email.value;
        // Recupera il valore email dal form

        const username = isRegister ? e.target.username.value : undefined;
        // Recupera il valore username dal form solo se è in modalità registrazione

        if (isRegister && password !== confirmPassword) {
            // Se è in modalità registrazione e le password non coincidono

            setFormError("Le password non coincidono");
            // Imposta un messaggio di errore

            return;
            // Esce dalla funzione senza inviare il form
        }

        setFormError("");
        // Resetta eventuali errori precedenti

        try {
            // Tenta di inviare il form

            await onSubmit({ email, password, username });
            // Chiama la funzione onSubmit passata come prop con i dati del form
        } catch (err) {
            // Se l'invio fallisce

            setFormError("Errore durante l'autenticazione.");
            // Imposta un messaggio di errore generico
        }
    };

    return (
        <div className="auth-box">
            {/* Contenitore del form di autenticazione */}

            <h2>{isRegister ? "Registrazione" : "Login"}</h2>
            {/* Titolo dinamico in base alla modalità corrente */}

            <form onSubmit={handleSubmit}>
                {/* Form che chiama handleSubmit quando inviato */}

                <div className="input-group">
                    {/* Gruppo per l'input email */}

                    <label>Email</label>
                    {/* Etichetta per il campo email */}

                    <input type="email" name="email" required />
                    {/* Campo di input di tipo email, obbligatorio */}
                </div>

                {isRegister && (
                    // Questo blocco viene renderizzato solo in modalità registrazione

                    <div className="input-group">
                        {/* Gruppo per l'input username */}

                        <label>Username</label>
                        {/* Etichetta per il campo username */}

                        <input type="text" name="username" required />
                        {/* Campo di input di tipo testo, obbligatorio */}
                    </div>
                )}

                <div className="input-group">
                    {/* Gruppo per l'input password */}

                    <label>Password</label>
                    {/* Etichetta per il campo password */}

                    <input
                        type="password"
                        name="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    // Aggiorna lo stato password quando l'input cambia
                    />
                </div>

                {isRegister && (
                    // Questo blocco viene renderizzato solo in modalità registrazione

                    <div className="input-group">
                        {/* Gruppo per la conferma password */}

                        <label>Conferma Password</label>
                        {/* Etichetta per la conferma password */}

                        <input
                            type="password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        // Aggiorna lo stato confirmPassword quando l'input cambia
                        />
                    </div>
                )}

                {(formError || error) && (
                    // Se c'è un errore (del form o passato come prop), mostra un messaggio

                    <p className="error-message">{formError || error}</p>
                    // Mostra il messaggio di errore
                )}

                <button type="submit">Invia</button>
                {/* Pulsante per inviare il form */}

                <a href="#" className="link-login" onClick={onToggle}>
                    {/* Link per passare tra login e registrazione */}

                    {isRegister ? "Hai già un account? Accedi" : "Registrati"}
                    {/* Testo dinamico in base alla modalità corrente */}
                </a>

                <div className="cookie-info">
                    {/* Informazioni sui cookie */}

                    <small>
                        Continuando, accetti la nostra policy sui cookie e privacy.
                        {/* Informazioni sulla privacy */}
                    </small>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;
// Esporta il componente AuthForm per poterlo utilizzare in altri file
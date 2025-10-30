import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/apiClients";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Email verificata con successo! Puoi ora effettuare il login.");
    useEffect(() => {
        if (!token) {
            setMessage("Token di verifica mancante.");
            return;
        }
        console.log("Verifying email with token:", token);
        api.get(`/api/auth/verify-email?token=${token}`)
            .then((res) => {
                if (res.data.success) {
                    setMessage("Email verificata con successo! Puoi ora effettuare il login.");
                } else {
                    setMessage("Link non valido o scaduto.");
                }
            })
            .catch((error) => {
                console.error("Errore durante la verifica dell'email:", error);
                setMessage("Errore durante la verifica dell'email. Il token potrebbe essere non valido o scaduto.");
            });

    }, [token]);

    return (
        <div className="verify-container">
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;

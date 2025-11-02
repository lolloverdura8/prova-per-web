import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/apiClients";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Email verificata con successo!, chiudi questa pagina e torna al login.");
    useEffect(() => {
        if (!token) {
            setMessage("Token di verifica mancante.");
            return;
        }
        console.log("Verifica email con token:", token);
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/api/auth/verify-email?token=${token}`);
                console.log("Verifica response:", response.data);
                if (response.data.success) {
                    setMessage("Email verificata con successo!");
                } else {
                    setMessage("Verifica fallita: " + (response.data.message || "Errore sconosciuto."));
                }
            } catch (error) {
                console.error("Errore durante la verifica della mail", error);
                setMessage("Errore durante la verifica dell'email.");
            }
        };
        verifyEmail();
    }, [token]);

    return (
        <div className="verify-container">
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;

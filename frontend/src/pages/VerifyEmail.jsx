import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/apiClients";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifica in corso...");
    useEffect(() => {
        if (!token) {
            setMessage("Token di verifica mancante.");
            return;
        }
        console.log("Verifying email with token:", token);
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/api/auth/verify-email?token=${token}`);
                console.log("Verification response:", response.data);
                if (response.data.success) {
                    setMessage("Email verificata con successo!");
                } else {
                    setMessage("Verifica fallita: " + (response.data.message || "Errore sconosciuto."));
                }
            } catch (error) {
                console.error("Error during email verification:", error);
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

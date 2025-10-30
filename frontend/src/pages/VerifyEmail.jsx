import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifica in corso...");

    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`)
            .then(() => setMessage("Email verificata con successo!"))
            .catch(() => setMessage("Link non valido o scaduto."));
    }, [token]);

    return (
        <div className="verify-container">
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;

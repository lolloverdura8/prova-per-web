import axios from "axios";

export const api = axios.create({
    baseURL: "https://prova-per-web-backend.onrender.com",
});

export const withAuth = (token) => ({
    headers: token ? { Authorization: `Bearer ${token}` } : {}
}); // Funzione per aggiungere l'header di autorizzazione
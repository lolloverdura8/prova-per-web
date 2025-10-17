import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

// export const withAuth = (token) => ({
//     headers: token ? { Authorization: `Bearer ${token}` } : {}
// }); // Funzione per aggiungere l'header di autorizzazione
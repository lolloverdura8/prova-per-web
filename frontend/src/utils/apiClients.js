import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true,
});

export const initCSRF = async () => {
    try {
        const res = await api.get("/api/csrf-token");
        api.defaults.headers["X-CSRF-Token"] = res.data?.csrfToken;
        console.log("CSRF token initialized", res.data.csrfToken);
    }
    catch (error) {
        console.error("Error initializing CSRF token:", error);
    }
};

// export const withAuth = (token) => ({
//     headers: token ? { Authorization: `Bearer ${token}` } : {}
// }); // Funzione per aggiungere l'header di autorizzazione
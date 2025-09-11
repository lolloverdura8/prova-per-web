import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import NotificationItem from "../components/Notificationitem";
import axios from "axios";
import "../styles/NotificationsPage.css";

const NotificationsPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user && !localStorage.getItem('token')) {
            navigate('/');
        }
    }, [user, navigate]);
    //redirect su login se non autenticato

    const fetchNotifications = async () => {
        if (!user) return; // Se l'utente non è definito, esci dall'effetto

        setLoading(true);
        setError(null); // Resetta l'errore prima di una nuova richiesta

        const token = localStorage.getItem('token');
        if (!token) { return; }

        try {
            const response = await axios.get("http://localhost:3000/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!Array.isArray(response.data)) {
                setNotifications([]);
                setError("Errore nel caricamento delle notifiche");
                return;
            }
            setNotifications(response.data);
            setError(null);
        } catch (error) {
            setNotifications([]);
            setError("Errore nel caricamento delle notifiche");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // .then(res => {
        //     if (!Array.isArray(res.data)) { 
        //         setNotifications([]);
        //         setError("Errore nel caricamento delle notifiche");
        //         return;
        //     }
        //     setNotifications(res.data);
        //     setError(null);
        // })
        // .catch(err => {
        //     setNotifications([]);
        //     setError("Errore nel caricamento delle notifiche");
        // })
        // .finally(() => setLoading(false));
        fetchNotifications();
    }, [user]) // Effettua la richiesta quando l'utente cambia


    useEffect(() => {
        const onRefresh = () => {
            fetchNotifications();
        };
        window.addEventListener('notifications:refresh', onRefresh);
        return () => window.removeEventListener('notifications:refresh', onRefresh);
    }, [fetchNotifications]);

    if (!user && localStorage.getItem('token')) {
        return <div className="loading">Loading...</div>;
    }

    if (loading) return <div className="loading">Caricamento notifiche...</div>;

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <h2>Notifiche</h2>
                    {error && <div className="error-message">{error}</div>}

                    {!error && notifications.length === 0 && (
                        <p>Nessuna notifica</p>
                    )}

                    {!error && notifications.length > 0 && (
                        notifications.map(n => (
                            <NotificationItem key={n._id} notification={n} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;

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

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        axios.get("http://localhost:3000/api/notifications", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                if (!Array.isArray(res.data)) {
                    setNotifications([]);
                    setError("Errore nel caricamento delle notifiche");
                    return;
                }
                setNotifications(res.data);
                setError(null);
            })
            .catch(err => {
                setNotifications([]);
                setError("Errore nel caricamento delle notifiche");
            })
            .finally(() => setLoading(false));
    }, [user]);

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

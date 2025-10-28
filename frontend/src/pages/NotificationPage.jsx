import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import NotificationItem from "../components/Notificationitem";
import "../styles/NotificationsPage.css";
import { api } from "../utils/apiClients";

const DEFAULT_LIMIT = 10;

const NotificationPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const [error, setError] = useState(null);

    // pagination
    const [page, setPage] = useState(1);
    const [limit] = useState(DEFAULT_LIMIT);
    const [hasMore, setHasMore] = useState(true);

    const fetchingRef = useRef(false);
    const sentinelRef = useRef(null);

    // redirect if not logged
    useEffect(() => {
        if (!initializing && !user) navigate("/");
    }, [user, initializing, navigate]);

    const resetList = useCallback(() => {
        setNotifications([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        if (fetchingRef.current || !hasMore) return;

        fetchingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const resp = await api.get(`/api/notifications?page=${page}&limit=${limit}`);
            // backend shape atteso: { success, data, pagination }
            const items = resp?.data?.data ?? [];
            const pagination = resp?.data?.pagination;

            setNotifications(prev => [...prev, ...items]);

            if (pagination) {
                setHasMore(pagination.currentPage < pagination.totalPages);
            } else {
                setHasMore(items.length === limit);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError("Errore nel caricamento delle notifiche");
        } finally {
            setLoading(false);
            fetchingRef.current = false;
            setInitializing(false);
        }
    }, [user, page, limit, hasMore]);

    // prima volta o cambio utente → reset e pagina 1
    useEffect(() => {
        if (!user) return;
        resetList();
    }, [user, resetList]);

    // ogni volta che cambia page → fetch
    useEffect(() => {
        if (!user) return;
        fetchNotifications();
    }, [page, user, fetchNotifications]);

    // evento custom per refresh (mantieni il tuo meccanismo)
    useEffect(() => {
        const onRefresh = () => {
            resetList();
            setPage(1);
        };
        window.addEventListener("notifications:refresh", onRefresh);
        return () => window.removeEventListener("notifications:refresh", onRefresh);
    }, [resetList]);

    // (opzionale) infinite scroll
    useEffect(() => {
        if (!sentinelRef.current) return;
        const io = new IntersectionObserver(
            entries => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading) {
                    setPage(p => p + 1);
                }
            },
            { rootMargin: "200px" }
        );
        io.observe(sentinelRef.current);
        return () => io.disconnect();
    }, [hasMore, loading]);

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="content-wrapper">
                    <h2>Notifiche</h2>

                    {error && <div className="error-message">{error}</div>}
                    {!error && notifications.length === 0 && !loading && (
                        <p>Nessuna notifica</p>
                    )}

                    {notifications.map(n => (
                        <NotificationItem key={n._id} notification={n} />
                    ))}

                    {loading && <div className="loading">Caricamento notifiche...</div>}

                    {!loading && hasMore && (
                        <button
                            className="load-more-btn"
                            onClick={() => setPage(p => p + 1)}
                        >
                            Carica altri
                        </button>
                    )}

                    {/* sentinel per infinite scroll */}
                    <div ref={sentinelRef} />
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;

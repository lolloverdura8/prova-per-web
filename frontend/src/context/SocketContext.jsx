import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import axios from "axios";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    console.log("SocketProvider montato!");
    const auth = useAuth();
    const user = auth ? auth.user : null;
    const socketRef = useRef(null);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

    // Segna tutte le notifiche come lette
    const markAllNotificationsAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post("http://localhost:3000/api/notifications/read-all", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHasUnreadNotifications(false);
        } catch (error) {
            console.error("Errore nel segnare le notifiche come lette:", error);
        }
    };

    // Controllo iniziale notifiche non lette
    useEffect(() => {
        const checkUnreadNotifications = async () => {
            if (user && user.id) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get("http://localhost:3000/api/notifications", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const hasUnread = response.data.some(n => !n.isRead);
                    setHasUnreadNotifications(hasUnread);
                } catch (error) {
                    console.error("Errore nel controllo notifiche non lette:", error);
                }
            }
        };
        checkUnreadNotifications();
    }, [user]);

    // Socket realtime
    useEffect(() => {
        console.log("useEffect SocketProvider, user:", user);
        if (user && user._id) {
            socketRef.current = io("http://localhost:3000");
            socketRef.current.on("connect", () => {
                console.log("Socket connesso!", socketRef.current.id);
                socketRef.current.emit("join", user._id);
                console.log("Join stanza", user._id);
            });

            socketRef.current.on("new-notification", (notifica) => {
                console.log("Ricevuta notifica realtime!", notifica);
                setHasUnreadNotifications(true);
            });
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{
            socket: socketRef.current,
            hasUnreadNotifications,
            setHasUnreadNotifications,
            markAllNotificationsAsRead
        }}>
            {children}
        </SocketContext.Provider>
    );
};
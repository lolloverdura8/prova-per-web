import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

import { authCookies } from '../utils/cookieUtils';
import { api } from "../utils/apiClients";

const SocketContext = createContext(null); // Inizializza con null
export const useSocket = () => useContext(SocketContext); // Hook personalizzato per usare il contesto

export const SocketProvider = ({ children }) => {
    console.log("SocketProvider montato!");
    const auth = useAuth();
    const user = auth ? auth.user : null;
    const socketRef = useRef(null); // Crea un ref per memorizzare l'istanza socket (socketRef.current), così da poterla leggere/modificare senza provocare rerender.
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false); // Stato per notifiche non lette

    // Segna tutte le notifiche come lette
    const markAllNotificationsAsRead = async () => {
        try {
            const token = authCookies.getAuthToken(); // Ottieni il token da localStorage
            await api.post('/api/notifications/mark-all-read', {}, withAuth(token));
            setHasUnreadNotifications(false); // Aggiorna lo stato locale
        } catch (error) {
            console.error("Errore nel segnare le notifiche come lette:", error);
        }
        // Viene fatta una post al backend per segnare tutte le notifiche come lette, chiamando l'endpoint apposito nel backend, poi si aggiorna lo stato locale.
    };

    // Controllo iniziale notifiche non lette
    useEffect(() => {
        const checkUnreadNotifications = async () => {
            if (user && user._id) {
                try {
                    const token = authCookies.getAuthToken();
                    const response = await withAuth(token).get("/api/notifications/unread");
                    const hasUnread = response.data.some(n => !n.isRead); // Controlla se c'è almeno una notifica non letta, setta hasUnread su true/false
                    setHasUnreadNotifications(hasUnread); // Aggiorna lo stato di hasUnreadNotifications
                } catch (error) {
                    console.error("Errore nel controllo notifiche non lette:", error);
                }
            }
        };
        checkUnreadNotifications(); // Esegui il controllo iniziale
    }, [user]); // Esegui l'effetto ogni volta che cambia l'utente

    // Socket realtime
    useEffect(() => {
        console.log("useEffect SocketProvider, user:", user);
        // Effetto che si attiva quando cambia l'utente (login/logout), per gestire la connessione socket
        if (user && user._id) {
            socketRef.current = io("http://localhost:3000"); // Connetti al server Socket.IO
            socketRef.current.on("connect", () => { // Evento di connessione riuscita
                console.log("Socket connesso!", socketRef.current.id);
                socketRef.current.emit("join", user._id); // Unisciti a una stanza specifica per l'utente
                console.log("Join stanza", user._id);
            });
            // socketRef è il riferimento all'istanza socket, usiamo socketRef.current per accedere all'istanza effettiva e registrare gli eventi e inviare messaggi. 

            socketRef.current.on("new-notification", (notifica) => {
                console.log("Ricevuta notifica realtime!", notifica); //log di debug
                setHasUnreadNotifications(true);
            });
            // Ascolta l'evento di nuova notifica e aggiorna lo stato delle notifiche non lette
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect(); // Disconnetti il socket quando il componente si smonta o l'utente cambia
                socketRef.current = null; // Pulisci il ref
                console.log("Socket disconnesso");
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
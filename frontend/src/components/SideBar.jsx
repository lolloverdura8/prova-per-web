import React from "react";
// Importa React per poter utilizzare JSX

import { FaHome, FaUser, FaCog, FaSearch, FaBookmark, FaSignOutAlt, FaBell } from "react-icons/fa";
// Importa diverse icone dalla libreria react-icons/fa (Font Awesome)

import { useLocation, useNavigate } from "react-router-dom";
// Importa hook per gestire la navigazione e conoscere l'URL corrente

import { useAuth } from "../context/AuthContext";
// Importa il hook personalizzato per accedere al contesto di autenticazione

import { useSocket } from "../context/SocketContext";
// Importa il hook personalizzato per accedere al contesto del socket

import UserSettings from "./UserSettings";
// Importa il componente per le impostazioni utente

import "../styles/Sidebar.css";
// Importa gli stili CSS per la barra laterale

const Sidebar = () => {
    // Definizione del componente Sidebar

    const location = useLocation();
    // Hook che restituisce l'oggetto location corrente (URL, percorso, ecc.)

    const navigate = useNavigate();
    // Hook che fornisce una funzione per navigare programmaticamente

    const { logout } = useAuth();
    // Estrae la funzione logout dal contesto di autenticazione

    const { hasUnreadNotifications, markAllNotificationsAsRead } = useSocket();
    // Estrae le funzioni per gestire le notifiche dal contesto del socket

    const path = location.pathname;
    // Estrae il percorso corrente dall'oggetto location

    const isActive = (route) => {
        // Funzione per determinare se una rotta è attiva

        return path === route;
        // Restituisce true se il percorso corrente corrisponde alla rotta specificata
    };

    const navigateTo = (route) => {
        // Funzione per navigare a una rotta specifica

        navigate(route);
        // Usa la funzione navigate per cambiare l'URL
    };

    const handleLogout = () => {
        // Funzione per gestire il logout

        logout();
        // Chiama la funzione logout dal contesto di autenticazione

        navigate('/');
        // Reindirizza alla pagina iniziale (login)
    };

    const handleNotificationClick = async () => {
        await markAllNotificationsAsRead();
        // Segna tutte le notifiche come lette
        window.dispatchEvent(new CustomEvent('notifications:refresh')); // Event per aggiornare le notifiche in altre parti dell'app
        navigate('/notifications');
        // Naviga alla pagina delle notifiche
    };

    return (
        <div className="sidebar">
            {/* Contenitore principale della barra laterale */}

            <div className="sidebar-logo">
                US
                {/* Logo della app (UniSocial) */}
            </div>

            <div
                className={`icon ${isActive('/home') ? 'active' : ''}`}
                // Classe condizionale: aggiunge 'active' se la rotta corrente è '/home'

                onClick={() => navigateTo('/home')}
                // Al click, naviga alla pagina home

                title="Home"
            // Tooltip che appare al passaggio del mouse
            >
                <FaHome />
                {/* Icona home */}
            </div>

            <div
                className={`icon ${isActive('/search') ? 'active' : ''}`}
                // Classe condizionale: aggiunge 'active' se la rotta corrente è '/search'

                onClick={() => navigateTo('/search')}
                // Al click, naviga alla pagina di ricerca

                title="Cerca"
            // Tooltip che appare al passaggio del mouse
            >
                <FaSearch />
                {/* Icona ricerca */}
            </div>

            <div
                className={`icon ${location.pathname === '/notifications' ? 'active' : ''} ${hasUnreadNotifications ? 'has-notifications' : ''}`}
                // Classe condizionale: aggiunge 'active' se la rotta corrente è '/notifications'
                onClick={handleNotificationClick}
                title="Notifiche"
            >
                <FaBell />
                {/* Icona notifiche */}
            </div>

            <div className={`icon ${isActive('/saved') ? 'active' : ''}`}
                // Classe condizionale: aggiunge 'active' se la rotta corrente è '/saved'
                onClick={() => navigateTo('/saved')}
            >

                <FaBookmark title="Salvati" />
                {/* Icona segnalibri (funzionalità non implementata) */}
            </div>

            <div className="sidebar-bottom">
                {/* Sezione inferiore della sidebar con icone per profilo, impostazioni e logout */}

                <div
                    className={`icon ${isActive('/profile') ? 'active' : ''}`}
                    // Classe condizionale: aggiunge 'active' se la rotta corrente è '/profile'

                    onClick={() => navigateTo('/profile')}
                    // Al click, naviga alla pagina del profilo

                    title="Profilo"
                // Tooltip che appare al passaggio del mouse
                >
                    <FaUser />
                    {/* Icona profilo utente */}
                </div>

                <div className="icon settings-icon">
                    <UserSettings />
                    {/* Componente per le impostazioni utente */}
                </div>

                <div
                    className="icon logout-icon"
                    onClick={handleLogout}
                    title="Esci"
                // Tooltip che appare al passaggio del mouse
                >
                    <FaSignOutAlt />
                    {/* Icona logout */}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
// Esporta il componente Sidebar per poterlo utilizzare in altri file
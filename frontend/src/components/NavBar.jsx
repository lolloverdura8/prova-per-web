import React from "react";
// Importa React per poter utilizzare JSX

import { useNavigate, useLocation } from "react-router-dom";
// Importa useNavigate per la navigazione e useLocation per ottenere il percorso corrente

import { useAuth } from "../context/AuthContext";
// Importa il hook personalizzato per accedere al contesto di autenticazione

import "../styles/Navbar.css";
// Importa gli stili CSS per la navbar

const Navbar = () => {
    // Definizione del componente Navbar

    const { user } = useAuth();
    // Estrae l'utente dal contesto di autenticazione

    const navigate = useNavigate();
    // Inizializza la funzione di navigazione

    const location = useLocation();
    // Ottiene informazioni sul percorso corrente

    // Determina il titolo della pagina in base al percorso
    const getPageTitle = () => {
        // Funzione per determinare il titolo in base al percorso

        switch (location.pathname) {
            // Utilizza uno switch per verificare il percorso

            case '/home':
                return 'Home';
            // Titolo per la homepage

            case '/search':
                return 'Cerca';
            // Titolo per la pagina di ricerca

            case '/profile':
                return 'Profilo';
            // Titolo per la pagina profilo

            default:
                return 'UniSocial';
            // Titolo predefinito per altre pagine
        }
    };

    const handleUserClick = () => {
        // Funzione per gestire il click sull'area utente

        navigate('/profile');
        // Naviga alla pagina del profilo utente
    };

    return (
        <div className="nav-bar">
            {/* Contenitore principale della barra di navigazione */}

            <h2>{getPageTitle()}</h2>
            {/* Titolo dinamico in base alla pagina corrente */}

            {user && (
                // Renderizza solo se c'è un utente autenticato

                <div
                    className="user-info"
                    onClick={handleUserClick}
                    role="button"
                    tabIndex={0}
                    aria-label="Vai al profilo"
                // Attributi per accessibilità e interattività
                >
                    <img
                        src={user?.avatar || '/path/to/default-avatar.png'}
                        alt={`Avatar di ${user?.username}`}
                        className="avatar-image"
                    />
                    <span className="username">{user.username}</span>
                    {/* Mostra il nome utente */}
                </div>
            )}
        </div>
    );
};

export default Navbar;
// Esporta il componente per poterlo utilizzare in altri file
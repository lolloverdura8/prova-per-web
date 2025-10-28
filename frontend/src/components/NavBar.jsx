import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/NavBar.css";

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const goToProfile = () => {
        navigate('/profile');
    };

    // Determina il titolo in base al percorso corrente
    const getPageTitle = () => {
        switch (location.pathname) {
            case '/home':
                return 'Home';
            case '/profile':
                return 'Profilo';
            case '/search':
                return 'Ricerca';
            default:
                return 'Home';
        }
    };

    return (
        <div className="nav-bar">
            <h2>{getPageTitle()}</h2>
            {user && (
                <div className="user-info" onClick={goToProfile}>
                    <span className="username">{user.username}</span>
                </div>
            )}
        </div>
    );
};

export default Navbar;
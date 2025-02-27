import React from "react";
import { FaHome, FaBell, FaUser, FaCog, FaSearch, FaBookmark, FaSignOutAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserSettings from "./UserSettings";
import "../styles/Sidebar.css";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const path = location.pathname;
    
    const isActive = (route) => {
        return path === route;
    };

    const navigateTo = (route) => {
        navigate(route);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                US
            </div>
            
            <div 
                className={`icon ${isActive('/home') ? 'active' : ''}`}
                onClick={() => navigateTo('/home')}
            >
                <FaHome />
            </div>
            
            <div 
                className={`icon ${isActive('/search') ? 'active' : ''}`}
                onClick={() => navigateTo('/search')}
            >
                <FaSearch />
            </div>
            
            <div className="icon">
                <FaBell />
            </div>
            
            <div className="icon">
                <FaBookmark />
            </div>
            
            <div className="sidebar-bottom">
                <div className="icon">
                    <FaUser />
                </div>
                
                <div className="icon settings-icon">
                    <UserSettings />
                </div>
                
                <div className="icon logout-icon" onClick={handleLogout}>
                    <FaSignOutAlt />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
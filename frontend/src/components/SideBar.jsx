import React from "react";
import { FaHome, FaBell, FaUser, FaCog, FaSearch, FaBookmark } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname;
    
    const isActive = (route) => {
        return path === route;
    };

    const navigateTo = (route) => {
        navigate(route);
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
                
                <div className="icon">
                    <FaCog />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
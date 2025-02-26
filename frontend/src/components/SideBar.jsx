import React, { useState } from "react";
import { FaHome, FaBell, FaUser, FaCog, FaSearch, FaBookmark } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
    const location = useLocation();
    const path = location.pathname;
    
    const isActive = (route) => {
        return path === route;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                US
            </div>
            
            <div className={`icon ${isActive('/home') ? 'active' : ''}`}>
                <FaHome />
            </div>
            
            <div className="icon">
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
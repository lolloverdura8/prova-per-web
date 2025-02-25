import React from "react";
import { FaHome, FaBell, FaUser, FaCog } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="icon">
                <FaHome />
            </div>
            <div className="icon">
                <FaBell />
            </div>
            <div className="icon">
                <FaUser />
            </div>
            <div className="icon">
                <FaCog />
            </div>
        </div>
    );
};

export default Sidebar;
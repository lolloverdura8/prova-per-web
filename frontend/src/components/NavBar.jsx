import React from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
    const { user } = useAuth();

    return (
        <div className="nav-bar">
            <h2>Home</h2>
            {user && (
                <div className="user-info">
                    {/* <img src={user.avatar || "https://via.placeholder.com/40"} alt="Avatar" className="avatar" /> */}
                    <span className="username">{user.username}</span>
                </div>
            )}
        </div>
    );
};

export default Navbar;
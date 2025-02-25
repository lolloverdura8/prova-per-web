import React from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import "../styles/HomePage.css";

const Home = () => {
    return (
        <div className="home-container">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <div className="welcome-box">
                    <h3>Benvenuto su UniSocial 📚</h3>
                    <p>
                        Qui puoi pubblicare post, commentare e interagire con
                        altri studenti.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;

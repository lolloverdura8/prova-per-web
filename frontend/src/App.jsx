import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import Saved from "./pages/Saved";
import NotificationPage from "./pages/NotificationPage";
import { getUserPreference, PREFERENCE_TYPES } from "./utils/preferenceUtils";
import './App.css';

function App() {
    console.log("App montata!");
    // Applica il tema salvato nei cookie quando l'app viene caricata
    useEffect(() => {
        const savedTheme = getUserPreference(PREFERENCE_TYPES.THEME);
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/saved" element={<Saved />} />
                        <Route path="/notifications" element={<NotificationPage />} />
                    </Routes>
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
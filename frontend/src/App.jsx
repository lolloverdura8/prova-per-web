import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import Saved from "./pages/Saved";
import { getUserPreference, PREFERENCE_TYPES } from "./utils/preferenceUtils";
import './App.css';
import NotificationPage from "./pages/NotificationPage";

function App() {
    // Applica il tema salvato nei cookie quando l'app viene caricata
    useEffect(() => {
        const savedTheme = getUserPreference(PREFERENCE_TYPES.THEME);
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    return (
        <AuthProvider>
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
        </AuthProvider>
    );
}

export default App;
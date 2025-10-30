import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
const HomePage = React.lazy(() => import("./pages/HomePage"));
import LoginPage from "./pages/LoginPage";
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const Saved = React.lazy(() => import("./pages/Saved"));
import NotificationPage from "./pages/NotificationPage";
import { getUserPreference, PREFERENCE_TYPES } from "./utils/preferenceUtils";
import './App.css';
import CookieBanner from "./components/CookieBanner";
import VerifyEmail from "./pages/VerifyEmail";

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
                <Suspense>
                    <Router>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/verify-email" element={<VerifyEmail />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/saved" element={<Saved />} />
                            <Route path="/notifications" element={<NotificationPage />} />
                        </Routes>
                        <CookieBanner />
                    </Router>
                </Suspense>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
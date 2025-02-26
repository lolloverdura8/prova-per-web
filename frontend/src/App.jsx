import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import './App.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
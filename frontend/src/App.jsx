import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;

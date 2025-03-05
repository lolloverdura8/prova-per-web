import React, { useEffect } from "react";
// Importa React e il hook useEffect

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// Importa i componenti per il routing dalla libreria react-router-dom

import { AuthProvider } from "./context/AuthContext";
// Importa il provider di autenticazione dal contesto creato

import Home from "./pages/HomePage";
// Importa il componente della pagina Home

import LoginPage from "./pages/LoginPage";
// Importa il componente della pagina di Login

import SearchPage from "./pages/SearchPage";
// Importa il componente della pagina di Ricerca

import { getUserPreference, PREFERENCE_TYPES } from "./utils/preferenceUtils";
// Importa le utility per gestire le preferenze utente

import './App.css';
// Importa gli stili CSS per l'app

function App() {
    // Componente principale dell'applicazione

    // Applica il tema salvato nei cookie quando l'app viene caricata
    useEffect(() => {
        // useEffect si esegue quando il componente viene montato

        const savedTheme = getUserPreference(PREFERENCE_TYPES.THEME);
        // Ottiene il tema salvato dalle preferenze utente

        if (savedTheme) {
            // Se esiste un tema salvato

            document.documentElement.setAttribute('data-theme', savedTheme);
            // Applica il tema all'elemento root HTML tramite l'attributo data-theme
        }
    }, []);
    // L'array vuoto di dipendenze indica che questo useEffect si esegue solo al montaggio dell'app

    return (
        <AuthProvider>
            {/* Avvolge l'intera applicazione con il provider di autenticazione */}

            <Router>
                {/* Configura il router per la navigazione */}

                <Routes>
                    {/* Definisce le rotte disponibili nell'applicazione */}

                    <Route path="/" element={<LoginPage />} />
                    {/* Rotta principale che mostra la pagina di login */}

                    <Route path="/home" element={<Home />} />
                    {/* Rotta per la pagina home */}

                    <Route path="/search" element={<SearchPage />} />
                    {/* Rotta per la pagina di ricerca */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
// Esporta il componente App come default per poterlo importare in altri file
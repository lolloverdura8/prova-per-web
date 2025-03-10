import React, { useState, useEffect } from "react";
// Importa React e gli hook useState e useEffect

import { useNavigate } from "react-router-dom";
// Importa useNavigate per la navigazione programmatica

import axios from "axios";
// Importa axios per le richieste HTTP

import Sidebar from "../components/SideBar";
// Importa il componente della barra laterale

import Navbar from "../components/NavBar";
// Importa il componente della barra di navigazione superiore

import Post from "../components/Post";
// Importa il componente per visualizzare un singolo post

import { FaSearch, FaTimes } from "react-icons/fa";
// Importa le icone di ricerca e chiusura da react-icons

import "../styles/SearchPage.css";
// Importa gli stili CSS per la pagina di ricerca

const SearchPage = () => {
    // Definizione del componente della pagina di ricerca

    const [searchQuery, setSearchQuery] = useState("");
    // Stato per memorizzare la query di ricerca inserita dall'utente

    const [searchResults, setSearchResults] = useState([]);
    // Stato per memorizzare i risultati della ricerca

    const [loading, setLoading] = useState(false);
    // Stato per gestire lo stato di caricamento durante la ricerca

    const [searched, setSearched] = useState(false);
    // Stato per tenere traccia se è stata effettuata una ricerca

    const [error, setError] = useState("");
    // Stato per memorizzare eventuali errori durante la ricerca

    const navigate = useNavigate();
    // Inizializza la funzione di navigazione

    // Autenticare l'utente quando la pagina si carica
    useEffect(() => {
        // Effetto che si esegue quando il componente si monta

        const token = localStorage.getItem('token');
        // Recupera il token dal localStorage

        if (!token) {
            // Se non c'è un token (utente non autenticato)

            navigate('/');
            // Reindirizza alla pagina di login
        }
    }, [navigate]);
    // L'effetto si riattiva se la funzione navigate cambia

    const handleSearch = async (e) => {
        // Funzione asincrona per gestire la ricerca

        e.preventDefault();
        // Previene il comportamento predefinito del form (ricarica della pagina)

        if (!searchQuery.trim()) return;
        // Se la query è vuota, esce dalla funzione

        setLoading(true);
        // Imposta lo stato di caricamento

        setSearched(true);
        // Indica che è stata effettuata una ricerca

        setError("");
        // Resetta eventuali errori precedenti

        try {
            // Tenta di eseguire la richiesta di ricerca

            const response = await axios.get(`http://localhost:3000/api/posts/search?query=${encodeURIComponent(searchQuery)}`);
            // Invia la richiesta GET all'API con la query codificata nell'URL

            // Assicuriamoci che i commenti abbiano informazioni complete sugli utenti
            const posts = response.data;
            // Estrae i post dalla risposta

            // Popolare i commenti con i dati dell'utente per ciascun post
            const populatedPosts = await Promise.all(posts.map(async (post) => {
                // Itera su ogni post usando Promise.all per gestire più richieste asincrone

                if (post.comments && post.comments.length > 0) {
                    // Se il post ha commenti

                    try {
                        // Tenta di caricare i commenti completi per questo post

                        const commentResponse = await axios.get(`http://localhost:3000/api/posts/${post._id}/comments`);
                        // Richiede i commenti dettagliati per il post corrente

                        return {
                            ...post,
                            comments: commentResponse.data
                            // Restituisce il post con i commenti popolati
                        };
                    } catch (error) {
                        // Se il caricamento dei commenti fallisce

                        console.error(`Errore nel caricare i commenti per il post ${post._id}:`, error);
                        // Logga l'errore nella console

                        return post;
                        // Restituisce il post originale senza modificare i commenti
                    }
                }
                return post;
                // Se il post non ha commenti, lo restituisce così com'è
            }));

            setSearchResults(populatedPosts);
            // Aggiorna lo stato con i post trovati e popolati
        } catch (error) {
            // Se la ricerca fallisce

            console.error("Errore durante la ricerca:", error);
            // Logga l'errore nella console

            setError("Si è verificato un errore durante la ricerca. Riprova più tardi.");
            // Imposta un messaggio di errore

            setSearchResults([]);
            // Resetta i risultati
        } finally {
            setLoading(false);
            // Termina lo stato di caricamento indipendentemente dal risultato
        }
    };

    const clearSearch = () => {
        // Funzione per cancellare la ricerca corrente

        setSearchQuery("");
        // Resetta la query di ricerca

        setSearchResults([]);
        // Resetta i risultati

        setSearched(false);
        // Indica che non c'è una ricerca attiva

        setError("");
        // Cancella eventuali errori
    };

    return (
        <div className="home-container">
            {/* Contenitore principale con lo stesso stile della home */}

            <Sidebar />
            {/* Renderizza la barra laterale */}

            <div className="main-content">
                {/* Contenitore del contenuto principale */}

                <Navbar />
                {/* Renderizza la barra di navigazione superiore */}

                <div className="content-wrapper">
                    {/* Wrapper per il contenuto */}

                    <div className="search-container">
                        {/* Contenitore specifico per la funzionalità di ricerca */}

                        <h2>Cerca Post</h2>
                        {/* Titolo della sezione */}

                        <form onSubmit={handleSearch} className="search-form">
                            {/* Form di ricerca che chiama handleSearch quando viene inviato */}

                            <div className="search-input-container">
                                {/* Contenitore per l'input di ricerca e il pulsante di cancellazione */}

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cerca nei post..."
                                    className="search-input"
                                />
                                {/* Campo di input per la query di ricerca */}

                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="clear-search-btn"
                                        onClick={clearSearch}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                                {/* Pulsante per cancellare la ricerca, visibile solo se c'è testo */}
                            </div>

                            <button type="submit" className="search-button">
                                <FaSearch /> Cerca
                            </button>
                            {/* Pulsante per inviare la ricerca */}
                        </form>

                        {loading && (
                            <div className="search-loading">
                                Ricerca in corso...
                            </div>
                        )}
                        {/* Indicatore di caricamento mostrato durante la ricerca */}

                        {error && (
                            <div className="search-error">
                                {error}
                            </div>
                        )}
                        {/* Mostra messaggi di errore se presenti */}

                        {searched && !loading && !error && (
                            <div className="search-results">
                                {/* Sezione risultati, visibile solo dopo una ricerca completata senza errori */}

                                <h3>Risultati della ricerca: {searchResults.length} post trovati</h3>
                                {/* Intestazione con conteggio dei risultati */}

                                {searchResults.length > 0 ? (
                                    // Se ci sono risultati
                                    <div className="post-list">
                                        {searchResults.map(post => (
                                            <Post key={post._id} post={post} />
                                            // Renderizza ogni post trovato usando il componente Post
                                        ))}
                                    </div>
                                ) : (
                                    // Se non ci sono risultati
                                    <div className="no-results">
                                        Nessun post corrisponde alla tua ricerca.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
// Esporta il componente per poterlo utilizzare in altri file
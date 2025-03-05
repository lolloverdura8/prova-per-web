import React, { useEffect, useState } from "react";
// Importa React e gli hook useEffect e useState

import axios from 'axios';
// Importa axios per le richieste HTTP

import Post from "./Post";
// Importa il componente Post per visualizzare i singoli post

import Autocomplete from "./AutoComplete";
// Importa il componente Autocomplete per i filtri

import { FaTimes } from "react-icons/fa";
// Importa l'icona X da react-icons

import '../styles/PostList.css';
// Importa gli stili CSS per questo componente

const PostList = ({ refreshTrigger }) => {
    // Definizione del componente PostList che accetta refreshTrigger come prop

    const [posts, setPosts] = useState([]);
    // Stato per memorizzare tutti i post scaricati dal server

    const [filteredPosts, setFilteredPosts] = useState([]);
    // Stato per memorizzare i post filtrati in base ai criteri di filtro

    const [loading, setLoading] = useState(true);
    // Stato per gestire la visualizzazione del caricamento

    const [error, setError] = useState('');
    // Stato per memorizzare eventuali errori

    // Filter states
    const [userFilter, setUserFilter] = useState('');
    // Stato per il filtro per utente

    const [dateFilter, setDateFilter] = useState('');
    // Stato per il filtro per data

    const [tagFilter, setTagFilter] = useState('');
    // Stato per il filtro per tag

    // Get unique authors from posts
    const uniqueAuthors = [...new Set(posts.map(post => post.author?.username).filter(Boolean))];
    // Crea un array di autori unici estraendo i nomi utente dagli autori dei post
    // Set garantisce valori unici, filter(Boolean) rimuove valori null o undefined

    // Get unique tags from posts
    const uniqueTags = [...new Set(posts.flatMap(post => post.tags || []).filter(Boolean))];
    // Crea un array di tag unici estraendo i tag da tutti i post
    // flatMap appiattisce l'array di array in un unico array, Set garantisce valori unici

    useEffect(() => {
        // Effetto che si attiva quando il componente si monta o refreshTrigger cambia

        const fetchPosts = async () => {
            // Funzione asincrona per recuperare i post dal server

            setLoading(true);
            // Imposta lo stato di caricamento

            setError('');
            // Resetta eventuali errori precedenti

            try {
                // Tenta di eseguire la richiesta

                const response = await axios.get('http://localhost:3000/api/posts');
                // Invia una richiesta GET all'endpoint dei post

                if (response.data) {
                    // Se la risposta contiene dati

                    setPosts(response.data);
                    // Aggiorna lo stato dei post con i dati ricevuti

                    setFilteredPosts(response.data);
                    // Inizialmente, i post filtrati sono gli stessi di tutti i post
                } else {
                    // Se la risposta non contiene dati

                    setError('No posts found');
                    // Imposta un messaggio di errore
                }
            } catch (error) {
                // Se la richiesta fallisce

                console.error('Error fetching posts:', error);
                // Logga l'errore nella console

                setError('Failed to load posts. Please try again later.');
                // Imposta un messaggio di errore per l'utente
            } finally {
                setLoading(false);
                // Termina lo stato di caricamento indipendentemente dal risultato
            }
        };

        fetchPosts();
        // Chiama la funzione per recuperare i post
    }, [refreshTrigger]);
    // L'effetto si riattiva quando refreshTrigger cambia

    // Apply filters whenever filter states or posts change
    useEffect(() => {
        // Effetto che si attiva quando i filtri o i post cambiano

        let result = [...posts];
        // Inizia con una copia di tutti i post

        // Filter by user
        if (userFilter) {
            // Se è attivo il filtro per utente

            result = result.filter(post =>
                post.author?.username?.toLowerCase() === userFilter.toLowerCase()
                // Filtra i post dove il nome utente dell'autore corrisponde al filtro
                // toLowerCase() rende il filtro case-insensitive
            );
        }

        // Filter by date
        if (dateFilter) {
            // Se è attivo il filtro per data

            const filterDate = new Date(dateFilter);
            // Converte la stringa in un oggetto Date

            result = result.filter(post => {
                // Filtra i post in base alla data

                const postDate = new Date(post.createdAt);
                // Converte la data del post in un oggetto Date

                return (
                    postDate.getFullYear() === filterDate.getFullYear() &&
                    postDate.getMonth() === filterDate.getMonth() &&
                    postDate.getDate() === filterDate.getDate()
                    // Confronta anno, mese e giorno per trovare i post della stessa data
                );
            });
        }

        // Filter by tag
        if (tagFilter) {
            // Se è attivo il filtro per tag

            result = result.filter(post =>
                post.tags && post.tags.includes(tagFilter)
                // Filtra i post che contengono il tag selezionato
            );
        }

        setFilteredPosts(result);
        // Aggiorna lo stato dei post filtrati
    }, [posts, userFilter, dateFilter, tagFilter]);
    // L'effetto si riattiva quando i post o qualsiasi filtro cambiano

    const clearFilters = () => {
        // Funzione per cancellare tutti i filtri

        setUserFilter('');
        // Resetta il filtro utente

        setDateFilter('');
        // Resetta il filtro data

        setTagFilter('');
        // Resetta il filtro tag
    };

    const formatDate = (date) => {
        // Funzione per formattare la data

        if (!date) return '';
        // Se la data è null/undefined, ritorna stringa vuota

        // Format date as DD/MM/YYYY
        const d = new Date(date);
        // Converte in oggetto Date

        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        // Formatta come DD/MM/YYYY con padding zero per giorni e mesi
    };

    if (loading) return <div className="loading-container">Caricamento post...</div>;
    // Se sta caricando, mostra un indicatore di caricamento

    if (error) return <div className="error-container">{error}</div>;
    // Se c'è un errore, mostra il messaggio di errore

    return (
        <div className="post-list-container">
            {/* Contenitore principale per l'elenco dei post */}

            <div className="filter-container">
                {/* Contenitore per i filtri */}

                <h3>Filtra Post</h3>
                {/* Titolo della sezione filtri */}

                <div className="filter-controls">
                    {/* Controlli per i filtri */}

                    <Autocomplete
                        id="user-filter"
                        options={uniqueAuthors}
                        value={userFilter}
                        onChange={setUserFilter}
                        placeholder="Cerca un autore..."
                        label="Per Autore:"
                    />
                    {/* Componente Autocomplete per filtrare per autore */}

                    <div className="filter-group">
                        <label htmlFor="date-filter">Per Data:</label>
                        <input
                            type="date"
                            id="date-filter"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                    {/* Input di tipo date per filtrare per data */}

                    <Autocomplete
                        id="tag-filter"
                        options={uniqueTags}
                        value={tagFilter}
                        onChange={setTagFilter}
                        placeholder="Cerca un tag..."
                        label="Per Tag:"
                    />
                    {/* Componente Autocomplete per filtrare per tag */}

                    <button
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        Cancella Filtri
                    </button>
                    {/* Pulsante per cancellare tutti i filtri */}
                </div>
            </div>

            <div className="post-list">
                {/* Contenitore per la lista dei post */}

                {filteredPosts.length > 0 ? (
                    // Se ci sono post filtrati

                    filteredPosts.map(post => (<Post key={post._id} post={post} />))
                    // Renderizza ogni post usando il componente Post, con una key unica
                ) : (
                    // Se non ci sono post filtrati

                    <div className="no-posts">
                        {userFilter || dateFilter || tagFilter
                            ? "Nessun post corrisponde ai tuoi filtri. Prova con criteri diversi."
                            // Messaggio se ci sono filtri attivi ma nessun risultato
                            : "Nessun post disponibile ancora. Sii il primo a crearne uno!"}
                            // Messaggio se non ci sono filtri attivi (non ci sono proprio post)
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostList;
// Esporta il componente PostList per poterlo utilizzare in altri file
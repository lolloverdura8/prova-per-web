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

    // Opzioni per l'autocomplete (ora caricate dal server)
    const [uniqueAuthors, setUniqueAuthors] = useState([]);
    // Stato per memorizzare gli autori unici per le opzioni dell'autocomplete

    const [uniqueTags, setUniqueTags] = useState([]);
    // Stato per memorizzare i tag unici per le opzioni dell'autocomplete

    // Carica tutti i post senza filtri
    const fetchPosts = async () => {
        // Funzione asincrona per recuperare tutti i post dal server

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

                // Estrai autori e tag unici per i filtri
                const authors = [...new Set(response.data
                    .map(post => post.author?.username)
                    .filter(Boolean))];
                // Estrae gli autori unici dai post

                setUniqueAuthors(authors);
                // Aggiorna lo stato degli autori unici

                const tags = [...new Set(response.data
                    .flatMap(post => post.tags || [])
                    .filter(Boolean))];
                // Estrae i tag unici dai post

                setUniqueTags(tags);
                // Aggiorna lo stato dei tag unici
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

    // Carica post filtrati dal server
    const fetchFilteredPosts = async () => {
        // Funzione asincrona per recuperare i post filtrati dal server

        setLoading(true);
        // Imposta lo stato di caricamento

        setError('');
        // Resetta eventuali errori precedenti

        try {
            // Tenta di eseguire la richiesta

            // Costruisci l'URL con i parametri di query in base ai filtri attivi
            let url = 'http://localhost:3000/api/posts/filter';
            // URL base per l'endpoint di filtro

            const params = new URLSearchParams();
            // Crea un oggetto URLSearchParams per costruire i parametri della query

            if (userFilter) params.append('author', userFilter);
            // Se c'è un filtro utente, aggiungilo ai parametri

            if (dateFilter) params.append('date', dateFilter);
            // Se c'è un filtro data, aggiungilo ai parametri

            if (tagFilter) params.append('tag', tagFilter);
            // Se c'è un filtro tag, aggiungilo ai parametri

            // Aggiungi i parametri all'URL solo se ce ne sono
            const queryString = params.toString();
            // Converte i parametri in una stringa di query

            if (queryString) {
                url += '?' + queryString;
                // Aggiunge la stringa di query all'URL
            }

            console.log("Invio richiesta filtrata a:", url);
            // Logga l'URL per debug

            const response = await axios.get(url);
            // Invia una richiesta GET all'URL con i filtri

            console.log("Risposta dal server:", response.data);
            // Logga la risposta per debug

            if (response.data) {
                // Se la risposta contiene dati

                setFilteredPosts(response.data);
                // Aggiorna lo stato dei post filtrati

                if (response.data.length === 0) {
                    // Se non ci sono risultati

                    // Non è un errore, solo nessun risultato
                    console.log("Nessun post corrisponde ai filtri");
                    // Logga un messaggio per debug
                }
            } else {
                // Se la risposta non contiene dati

                setFilteredPosts([]);
                // Imposta un array vuoto

                setError('Nessun post trovato');
                // Imposta un messaggio di errore
            }
        } catch (error) {
            // Se la richiesta fallisce

            console.error('Error fetching filtered posts:', error);
            // Logga l'errore nella console

            setError(`Impossibile caricare i post filtrati: ${error.message}`);
            // Imposta un messaggio di errore dettagliato

            setFilteredPosts([]);
            // Resetta i post filtrati
        } finally {
            setLoading(false);
            // Termina lo stato di caricamento indipendentemente dal risultato
        }
    };

    // Carica i post quando il componente si monta o il trigger di aggiornamento cambia
    useEffect(() => {
        // Effetto che si attiva quando il componente si monta o refreshTrigger cambia

        fetchPosts();
        // Chiama la funzione per recuperare tutti i post
    }, [refreshTrigger]);
    // L'effetto si riattiva quando refreshTrigger cambia

    // Applica i filtri (ora chiama il backend invece di filtrare localmente)
    useEffect(() => {
        // Effetto che si attiva quando cambiano i filtri o posts.length

        // Se non ci sono filtri attivi, mostra tutti i post
        if (!userFilter && !dateFilter && !tagFilter) {
            // Se non c'è nessun filtro attivo

            setFilteredPosts(posts);
            // Usa tutti i post (nessun filtro)

            console.log("Nessun filtro attivo, mostro tutti i post");
            // Logga un messaggio per debug
        } else {
            // Se c'è almeno un filtro attivo

            // Altrimenti, richiedi i post filtrati dal server
            console.log("Filtri attivi, richiedo post filtrati");
            // Logga un messaggio per debug

            fetchFilteredPosts();
            // Chiama la funzione per recuperare i post filtrati
        }
    }, [userFilter, dateFilter, tagFilter, posts.length]);
    // L'effetto si riattiva quando cambia uno qualsiasi dei filtri o il numero di post

    const clearFilters = () => {
        // Funzione per cancellare tutti i filtri

        setUserFilter('');
        // Resetta il filtro utente

        setDateFilter('');
        // Resetta il filtro data

        setTagFilter('');
        // Resetta il filtro tag
    };

    if (loading && filteredPosts.length === 0) return <div className="loading-container">Caricamento post...</div>;
    // Se sta caricando e non ci sono post da mostrare, mostra un indicatore di caricamento

    if (error && filteredPosts.length === 0) return <div className="error-container">{error}</div>;
    // Se c'è un errore e non ci sono post da mostrare, mostra il messaggio di errore

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
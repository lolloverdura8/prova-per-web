import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from 'axios';

import Post from "./Post";

import Autocomplete from "./AutoComplete";

import { FaTimes } from "react-icons/fa";

import '../styles/PostList.css';

const PostList = ({ refreshTrigger, savedMode }) => {

    const [posts, setPosts] = useState([]);

    const [filteredPosts, setFilteredPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');

    // Filter states
    const [userFilter, setUserFilter] = useState('');

    const [dateFilter, setDateFilter] = useState('');

    const [tagFilter, setTagFilter] = useState('');

    const [dateInput, setDateInput] = useState(null); // ora è un oggetto Date o null

    // Opzioni per l'autocomplete (ora caricate dal server)
    const [uniqueAuthors, setUniqueAuthors] = useState([]);

    const [uniqueTags, setUniqueTags] = useState([]);

    // Carica tutti i post senza filtri
    const fetchPosts = async () => {
        // Funzione asincrona per recuperare tutti i post dal server

        setLoading(true);
        // Imposta lo stato di caricamento

        setError('');
        // Resetta eventuali errori precedenti

        try {

            const response = await axios.get('http://localhost:3000/api/posts');
            // Invia una richiesta GET all'endpoint dei post

            if (response.data) {

                setPosts(response.data);
                // Aggiorna lo stato dei post con i dati ricevuti

                setFilteredPosts(response.data);
                // Inizialmente, i post filtrati sono gli stessi di tutti i post


                const authors = [...new Set(response.data //Set è una struttura dati che memorizza valori unici
                    .map(post => post.author?.username)
                    .filter(Boolean) /* Filtra valori null/undefined*/)];
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
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            // Logga l'errore nella console

            setError('Failed to load posts. Please try again later.');
            // Imposta un messaggio di errore per l'utente
        } finally {
            setLoading(false);
            // Termina lo stato di caricamento indipendentemente dal risultato
        }
    };

    // Carica post filtrati
    // const fetchFilteredPosts = async () => {
    //     // Funzione asincrona per recuperare i post filtrati dal server

    //     setLoading(true);
    //     // Imposta lo stato di caricamento

    //     setError('');
    //     // Resetta eventuali errori precedenti

    //     try {

    //         // Costruisci l'URL con i parametri di query in base ai filtri attivi
    //         let url = 'http://localhost:3000/api/posts/filter';
    //         // URL base per l'endpoint di filtro

    //         const params = new URLSearchParams();
    //         // Crea un oggetto URLSearchParams per costruire i parametri della query

    //         if (userFilter) params.append('author', userFilter);
    //         // Se c'è un filtro utente, aggiungilo ai parametri

    //         if (dateFilter) params.append('date', dateFilter);
    //         // Se c'è un filtro data, aggiungilo ai parametri

    //         if (tagFilter) params.append('tag', tagFilter);
    //         // Se c'è un filtro tag, aggiungilo ai parametri

    //         // Aggiungi i parametri all'URL solo se ce ne sono
    //         const queryString = params.toString();
    //         // Converte i parametri in una stringa di query

    //         if (queryString) {
    //             url += '?' + queryString;
    //             // Aggiunge la stringa di query all'URL
    //         }

    //         console.log("Invio richiesta filtrata a:", url);
    //         // Logga l'URL per debug

    //         const response = await axios.get(url);
    //         // Invia una richiesta GET all'URL con i filtri

    //         console.log("Risposta dal server:", response.data);
    //         // Logga la risposta per debug

    //         if (response.data) {
    //             // Se la risposta contiene dati

    //             setFilteredPosts(response.data);
    //             // Aggiorna lo stato dei post filtrati

    //             if (response.data.length === 0) {
    //                 // Se non ci sono risultati

    //                 // Non è un errore, solo nessun risultato
    //                 console.log("Nessun post corrisponde ai filtri");
    //                 // Logga un messaggio per debug
    //             }
    //         } else {
    //             // Se la risposta non contiene dati

    //             setFilteredPosts([]);
    //             // Imposta un array vuoto

    //             setError('Nessun post trovato');
    //             // Imposta un messaggio di errore
    //         }
    //     } catch (error) {
    //         // Se la richiesta fallisce

    //         console.error('Error fetching filtered posts:', error);
    //         // Logga l'errore nella console

    //         setError(`Impossibile caricare i post filtrati: ${error.message}`);
    //         // Imposta un messaggio di errore dettagliato

    //         setFilteredPosts([]);
    //         // Resetta i post filtrati
    //     } finally {
    //         setLoading(false);
    //         // Termina lo stato di caricamento indipendentemente dal risultato
    //     }
    // };

    //effetto per caricare i post salvati
    useEffect(() => {
        // Effetto che si attiva quando il componente si monta o refresh

        if (savedMode) {

            const fetchSavedPosts = async () => {
                // Funzione per recuperare i post salvati

                setLoading(true);
                // Imposta lo stato di caricamento

                setError('');
                // Resetta eventuali errori precedenti

                try {
                    const token = localStorage.getItem('token');

                    const response = await axios.get('http://localhost:3000/api/posts/saved', {
                        headers: {
                            Authorization: `Bearer ${token}` // Includi il token nell'header di autorizzazione per evitare errori 401
                        }
                    });
                    // Invia una richiesta GET all'endpoint dei post salvati

                    if (response.data) {

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

                        setError('No saved posts found');
                    }
                } catch (error) {

                    console.error('Error fetching saved posts:', error);

                    setError('Failed to load saved posts. Please try again later.');
                } finally {
                    setLoading(false);
                    // Termina lo stato di caricamento indipendentemente dal risultato
                }
            };

            fetchSavedPosts();
            // Chiama la funzione per recuperare i post salvati
        } else {
            // Se non siamo nella modalità salvati

            fetchPosts();
            // Chiama la funzione per recuperare tutti i post
        }
    }, [refreshTrigger, savedMode]);
    // L'effetto si riattiva quando refreshTrigger o savedMode cambiano

    // Applica i filtri (ora chiama il backend invece di filtrare localmente) 
    useEffect(() => {
        setLoading(true);
        setError('');

        const params = new URLSearchParams(); // Crea un oggetto URLSearchParams per costruire i parametri della query
        if (userFilter) params.append('author', userFilter); // Se c'è un filtro utente, aggiungilo ai parametri
        if (dateFilter) params.append('date', dateFilter); // Se c'è un filtro data, aggiungilo ai parametri
        if (tagFilter) params.append('tag', tagFilter); // Se c'è un filtro tag, aggiungilo ai parametri

        let url; // URL base per l'endpoint di filtro
        let headers = {}; // Intestazioni della richiesta
        if (savedMode) {
            // Siamo nella pagina "Salvati"
            url = `http://localhost:3000/api/posts/saved/filter`;
            const token = localStorage.getItem('token'); // Ottieni il token da localStorage
            if (token) headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Siamo in homepage
            url = `http://localhost:3000/api/posts/filter`;
        }

        // Se NON ci sono filtri, carica la lista completa (come all'inizio)
        if (!userFilter && !dateFilter && !tagFilter) {
            if (savedMode) {
                // Lista completa dei post salvati
                axios.get('http://localhost:3000/api/posts/saved', { headers })
                    .then(response => {
                        setFilteredPosts(response.data);
                        const authors = [...new Set(response.data.map(post => post.author?.username).filter(Boolean))]; //map estra in base a return della callback
                        setUniqueAuthors(authors);
                        const tags = [...new Set(response.data.flatMap(post => post.tags || []).filter(Boolean))]; //flatMap appiattisce l'array di array in un singolo array
                        setUniqueTags(tags);
                    })
                    .catch(error => {
                        setError('Errore nel caricamento dei post');
                        setFilteredPosts([]);
                    })
                    .finally(() => setLoading(false));

                //esempio di chiamata alternativa con async/await
                // const response = await axios.get('http://localhost:3000/api/posts/saved', { headers });
                // if (response.data) {
                //     setFilteredPosts(response.data);
                //     const authors = [...new Set(response.data.map(post => post.author?.username).filter(Boolean))]; //map estra in base a return della callback
                //     setUniqueAuthors(authors);
                //     const tags = [...new Set(response.data.flatMap(post => post.tags || []).filter(Boolean))]; //flatMap appiattisce l'array di array in un singolo array
                //     setUniqueTags(tags);
                // } else {
                //     setError('No saved posts found');
                // }

            } else {
                // Lista completa di tutti i post
                axios.get('http://localhost:3000/api/posts')
                    .then(response => {
                        setFilteredPosts(response.data);
                        const authors = [...new Set(response.data.map(post => post.author?.username).filter(Boolean))];
                        setUniqueAuthors(authors);
                        const tags = [...new Set(response.data.flatMap(post => post.tags || []).filter(Boolean))];
                        setUniqueTags(tags);
                    })
                    .catch(error => {
                        setError('Errore nel caricamento dei post');
                        setFilteredPosts([]);
                    })
                    .finally(() => setLoading(false));
            }
            return;
        }

        // Se ci sono filtri, chiama il backend per i post filtrati
        if (params.toString()) url += `?${params.toString()}`;

        axios.get(url, { headers })
            .then(response => {
                setFilteredPosts(response.data);
                const authors = [...new Set(response.data.map(post => post.author?.username).filter(Boolean))];
                setUniqueAuthors(authors);
                const tags = [...new Set(response.data.flatMap(post => post.tags || []).filter(Boolean))];
                setUniqueTags(tags);
            })
            .catch(error => {
                setError('Errore nel caricamento dei post');
                setFilteredPosts([]);
            })
            .finally(() => setLoading(false));
    }, [userFilter, dateFilter, tagFilter, refreshTrigger, savedMode]);
    // L'effetto si riattiva quando cambia uno qualsiasi dei filtri o il numero di post

    const clearFilters = () => {
        setUserFilter('');
        setDateFilter('');
        setDateInput(null);
        setTagFilter('');
    };
    // Funzione per cancellare tutti i filtri

    if (loading && filteredPosts.length === 0) return <div className="loading-container">Caricamento post...</div>;

    if (error && filteredPosts.length === 0) return <div className="error-container">{error}</div>;

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
                        <DatePicker
                            id="date-filter"
                            selected={dateInput}
                            onChange={date => {
                                setDateInput(date);
                                if (date) {
                                    // Formatta la data in YYYY-MM-DD per il backend
                                    const formatted = date.toISOString().slice(0, 10);
                                    setDateFilter(formatted);
                                } else {
                                    setDateFilter('');
                                }
                            }}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Seleziona una data"
                            isClearable
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
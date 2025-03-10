import React, { useEffect, useState } from "react";
// Importa React e gli hook useEffect e useState

import { useNavigate } from "react-router-dom";
// Importa useNavigate per la navigazione programmatica

import axios from 'axios';
// Importa axios per le richieste HTTP

import { useAuth } from "../context/AuthContext";
// Importa il hook personalizzato per accedere al contesto di autenticazione

import Sidebar from "../components/SideBar";
// Importa il componente della barra laterale

import Navbar from "../components/NavBar";
// Importa il componente della barra di navigazione

import Post from "../components/Post";
// Importa il componente per visualizzare un singolo post

import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
// Importa le icone da react-icons

import "../styles/ProfilePage.css";
// Importa gli stili CSS per la pagina profilo

const ProfilePage = () => {
    // Definizione del componente ProfilePage

    const { user, setUser } = useAuth();
    // Estrae l'utente e la funzione per aggiornarlo dal contesto di autenticazione

    const navigate = useNavigate();
    // Inizializza la funzione di navigazione

    const [userPosts, setUserPosts] = useState([]);
    // Stato per memorizzare i post dell'utente

    const [loading, setLoading] = useState(true);
    // Stato per gestire lo stato di caricamento

    const [error, setError] = useState('');
    // Stato per memorizzare eventuali errori

    const [editMode, setEditMode] = useState(false);
    // Stato per gestire la modalità di modifica del profilo

    const [profileData, setProfileData] = useState({
        username: '',
        email: ''
    });
    // Stato per i dati del profilo in fase di modifica

    useEffect(() => {
        // Effetto che si attiva al caricamento della pagina o quando user o navigate cambiano

        // Redirect to login if not authenticated
        if (!user && !localStorage.getItem('token')) {
            // Se non c'è un utente autenticato e non c'è un token nel localStorage

            navigate('/');
            // Reindirizza alla pagina di login
        }

        // Inizializza i dati del profilo quando l'utente è caricato
        if (user) {
            setProfileData({
                username: user.username || '',
                email: user.email || ''
            });
        }
    }, [user, navigate]);
    // L'effetto si riattiva quando user o navigate cambiano

    useEffect(() => {
        // Effetto che carica i post dell'utente

        const fetchUserPosts = async () => {
            // Funzione asincrona per recuperare i post dell'utente

            if (!user) return;
            // Se non c'è utente, esce dalla funzione

            setLoading(true);
            // Imposta lo stato di caricamento

            setError('');
            // Resetta eventuali errori precedenti

            try {
                // Tenta di eseguire la richiesta

                // Utilizziamo l'endpoint di filtro per ottenere i post dell'utente
                const response = await axios.get(`http://localhost:3000/api/posts/filter?author=${user.username}`);
                // Invia una richiesta GET all'endpoint di filtro, specificando l'username come autore

                if (response.data) {
                    // Se la risposta contiene dati

                    setUserPosts(response.data);
                    // Aggiorna lo stato con i post dell'utente
                } else {
                    // Se la risposta non contiene dati

                    setUserPosts([]);
                    // Imposta un array vuoto
                }
            } catch (error) {
                // Se la richiesta fallisce

                console.error('Error fetching user posts:', error);
                // Logga l'errore nella console

                setError('Impossibile caricare i tuoi post. Riprova più tardi.');
                // Imposta un messaggio di errore per l'utente
            } finally {
                // Eseguito indipendentemente dal risultato della richiesta

                setLoading(false);
                // Termina lo stato di caricamento
            }
        };

        fetchUserPosts();
        // Chiama la funzione per recuperare i post
    }, [user]);
    // L'effetto si riattiva quando l'utente cambia

    // Gestisce l'attivazione della modalità di modifica
    const handleEditProfileClick = () => {
        setEditMode(true);
    };

    // Gestisce la cancellazione delle modifiche
    const handleCancelEdit = () => {
        // Ripristina i dati originali
        setProfileData({
            username: user.username || '',
            email: user.email || ''
        });
        setEditMode(false);
    };

    // Gestisce il salvataggio delle modifiche al profilo
    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:3000/api/users/profile',
                profileData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Aggiorna l'utente nel contesto
            if (response.data) {
                setUser(response.data);
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Errore durante l\'aggiornamento del profilo. Riprova più tardi.');
        }
    };

    // Gestisce i cambiamenti nei campi di input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // If still checking authentication status, show loading
    if (!user && localStorage.getItem('token')) {
        // Se c'è un token ma l'utente non è ancora caricato (autenticazione in corso)

        return <div className="loading">Loading...</div>;
        // Mostra un indicatore di caricamento
    }

    return (
        <div className="home-container">
            {/* Contenitore principale con lo stesso stile della home */}

            <Sidebar />
            {/* Renderizza la barra laterale */}

            <div className="main-content">
                {/* Contenitore del contenuto principale */}

                <Navbar />
                {/* Renderizza la barra di navigazione */}

                <div className="profile-container">
                    {/* Contenitore per il layout a due colonne */}

                    <div className="profile-info">
                        {/* Colonna di sinistra con le informazioni dell'utente */}

                        <div className="profile-avatar">
                            {/* Avatar dell'utente */}
                            <img
                                src={user?.avatar || '/path/to/default-avatar.png'}
                                alt={`Avatar di ${user?.username}`}
                                className="avatar-image"
                            />
                        </div>

                        {editMode ? (
                            <div className="profile-edit-form">
                                <div className="input-group">
                                    <label htmlFor="username">Nome utente</label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={profileData.username}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="profile-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={handleCancelEdit}
                                    >
                                        <FaTimes /> Annulla
                                    </button>
                                    <button
                                        className="save-btn"
                                        onClick={handleSaveProfile}
                                    >
                                        <FaCheck /> Salva
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="profile-username">{user?.username}</h2>
                                <p className="profile-email">{user?.email}</p>

                                <button
                                    className="edit-profile-btn"
                                    onClick={handleEditProfileClick}
                                >
                                    <FaEdit /> Modifica profilo
                                </button>
                            </>
                        )}

                        <div className="profile-stats">
                            {/* Sezione per le statistiche dell'utente */}

                            <div className="stat-item">
                                {/* Elemento di statistica singolo */}

                                <span className="stat-value">{userPosts.length}</span>
                                {/* Valore numerico (numero di post) */}

                                <span className="stat-label">Post</span>
                                {/* Etichetta della statistica */}
                            </div>
                            {/* Potremmo aggiungere altre statistiche in futuro */}
                        </div>
                    </div>

                    <div className="profile-posts">
                        {/* Colonna di destra con i post dell'utente */}

                        <h3>I tuoi post</h3>
                        {/* Titolo della sezione */}

                        {loading ? (
                            // Se sta caricando

                            <div className="loading-container">Caricamento post...</div>
                            // Mostra un indicatore di caricamento
                        ) : error ? (
                            // Se c'è un errore

                            <div className="error-container">{error}</div>
                            // Mostra il messaggio di errore
                        ) : userPosts.length > 0 ? (
                            // Se ci sono post da mostrare

                            <div className="user-post-list">
                                {/* Contenitore per la lista dei post */}

                                {userPosts.map(post => (
                                    // Itera su ogni post

                                    <Post key={post._id} post={post} />
                                    // Renderizza il componente Post per ogni post
                                ))}
                            </div>
                        ) : (
                            // Se non ci sono post

                            <div className="no-posts">
                                Non hai ancora creato nessun post.
                                {/* Messaggio quando non ci sono post */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
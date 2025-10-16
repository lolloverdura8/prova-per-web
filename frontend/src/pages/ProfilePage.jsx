import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, withAuth } from "../utils/apiClients";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import Post from "../components/Post";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import "../styles/ProfilePage.css";
import { authCookies } from "../utils/cookieUtils";


const ProfilePage = () => {

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

        // redirect su login se non autenticato
        if (!user && !authCookies.getAuthToken()) {
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

                // Utilizziamo l'endpoint di filtro per ottenere i post dell'utente
                const response = await api.get(`/api/posts?author=${user.username}`);
                // Invia una richiesta GET all'endpoint di filtro, specificando l'username come autore

                if (response.data) {

                    setUserPosts(response.data);
                    // Aggiorna lo stato con i post dell'utente
                } else {

                    setUserPosts([]);
                    // Imposta un array vuoto
                }
            } catch (error) {

                console.error('Error fetching user posts:', error);
                // Logga l'errore nella console

                setError('Impossibile caricare i tuoi post. Riprova più tardi.');
                // Imposta un messaggio di errore per l'utente
            } finally {

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
            const token = authCookies.getAuthToken();
            const response = await api.put('/api/users/profile', profileData, withAuth(token));
            //Uso put e non post perché sto aggiornando un dato esistente

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

    const handleDeletePost = async (postId) => {

        if (!window.confirm("Vuoi davvero eliminare questo post?")) return;

        try {
            await api.delete(`/api/posts/${postId}`);
            setUserPosts(userPosts.filter(p => p._id !== postId)); // aggiorna lista
        } catch (err) {
            console.error("Errore durante l'eliminazione:", err);
            alert("Errore: impossibile eliminare il post.");
        }
    };

    if (!user && authCookies.getAuthToken()) {
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

                            <div className="error-container">{error}</div>

                        ) : userPosts.length > 0 ? (

                            <div className="user-post-list">
                                {/* Contenitore per la lista dei post */}

                                {userPosts.map(post => (
                                    // Itera su ogni post

                                    <Post key={post._id} post={post} onDelete={handleDeletePost} />
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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import PostList from "../components/PostList";
import FloatingActionButton from "../components/FloatingActionButton";
import PostModal from "../components/PostModal";
import "../styles/HomePage.css";
import { authCookies } from "../utils/cookieUtils";

const Home = () => {
    const { user } = useAuth();
    // Estrae l'utente dal contesto di autenticazione

    const navigate = useNavigate();
    // Inizializza la funzione di navigazione

    const [refreshPosts, setRefreshPosts] = useState(false);
    // Stato per forzare l'aggiornamento della lista dei post (true/false come trigger)

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    // Stato per controllare se il modal di creazione post è aperto o chiuso

    useEffect(() => {
        // Effetto che si esegue quando il componente si monta o quando le dipendenze cambiano

        // Redirect to login if not authenticated
        if (!user && !authCookies.getAuthToken()) {
            // Se non c'è un utente e non c'è un token

            navigate('/');
            // Reindirizza alla pagina di login
        }
    }, [user, navigate]);
    // L'effetto si riattiva quando l'utente o la funzione di navigazione cambiano

    if (!user && authCookies.getAuthToken()) {
        // Se c'è un token ma l'utente non è ancora caricato (autenticazione in corso)

        return <div className="loading">Loading...</div>;
        // Mostra un indicatore di caricamento
    }

    const handlePostCreated = (newPost) => {
        // Funzione chiamata quando viene creato un nuovo post

        setRefreshPosts(prev => !prev);
        // Inverte il valore di refreshPosts per forzare l'aggiornamento della lista, prev è il valore precedente
    };

    const openPostModal = () => {
        // Funzione per aprire il modal di creazione post

        setIsPostModalOpen(true);
        // Imposta lo stato del modal su "aperto"
    };

    const closePostModal = () => {
        // Funzione per chiudere il modal di creazione post

        setIsPostModalOpen(false);
        // Imposta lo stato del modal su "chiuso"
    };

    return (
        <div className="home-container">
            {/* Contenitore principale della home page */}

            <Sidebar />
            {/* Renderizza la barra laterale */}

            <div className="main-content">
                {/* Contenitore del contenuto principale */}

                <Navbar />
                {/* Renderizza la barra di navigazione */}

                <div className="content-wrapper">
                    {/* Wrapper per il contenuto centrale */}

                    <PostList refreshTrigger={refreshPosts} />
                    {/* Renderizza la lista dei post, passando il trigger di aggiornamento */}
                </div>
            </div>

            {/* Floating Action Button for creating a new post */}
            <FloatingActionButton onClick={openPostModal} />
            {/* Renderizza il pulsante flottante, configurato per aprire il modal */}

            {/* Post Creation Modal */}
            <PostModal
                isOpen={isPostModalOpen}
                // Passa lo stato di apertura del modal

                onClose={closePostModal}
                // Passa la funzione per chiuderlo

                onPostCreated={handlePostCreated}
            // Passa la funzione da chiamare quando un post viene creato
            />
        </div>
    );
};

export default Home;
// Esporta il componente Home per poterlo utilizzare in altri file
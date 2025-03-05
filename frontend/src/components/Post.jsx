import React, { useState, useEffect } from "react";
// Importa React e gli hook useState e useEffect

import axios from 'axios';
// Importa axios per le richieste HTTP

import { Comments, AddComment } from "./Comment";
// Importa i componenti per visualizzare e aggiungere commenti

import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
// Importa le icone per il cuore (pieno e vuoto) e commenti

import '../styles/Post.css';
// Importa gli stili CSS per il componente Post

const Post = ({ post }) => {
    // Definizione del componente Post che riceve un oggetto post come prop

    const { _id, description, author, createdAt, comments, likes = [], tags = [] } = post;
    // Destruttura le proprietà dal post con valori predefiniti per likes e tags se mancanti

    const [postComments, setPostComments] = useState(comments || []);
    // Stato locale per i commenti, inizializzato con quelli del post o un array vuoto

    const [showComments, setShowComments] = useState(false);
    // Stato per controllare la visibilità della sezione commenti

    const [likesCount, setLikesCount] = useState(likes.length);
    // Stato per il conteggio dei like, inizializzato con la lunghezza dell'array likes

    const [isLiked, setIsLiked] = useState(false);
    // Stato per tracciare se l'utente corrente ha messo like al post

    // Check if the current user has liked this post
    useEffect(() => {
        // Effetto che si attiva quando il componente si monta o likes cambia

        const checkIfLiked = async () => {
            // Funzione asincrona per verificare se l'utente ha messo like

            try {
                // Tenta di eseguire la verifica

                const token = localStorage.getItem('token');
                // Recupera il token dal localStorage

                if (!token) return;
                // Se non c'è token (utente non autenticato), esce dalla funzione

                const userData = await axios.get('http://localhost:3000/api/users/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                    // Imposta l'header di autorizzazione con il token
                });
                // Richiede i dati dell'utente corrente dal server

                if (userData.data && userData.data._id) {
                    // Se i dati utente sono validi e contengono un ID

                    setIsLiked(likes.includes(userData.data._id));
                    // Imposta isLiked a true se l'ID dell'utente è presente nell'array likes
                }
            } catch (error) {
                // Gestisce eventuali errori

                console.error('Error checking like status:', error);
                // Logga l'errore nella console
            }
        };

        checkIfLiked();
        // Chiama la funzione di verifica
    }, [likes]);
    // L'effetto si riattiva quando l'array likes cambia

    const handleLike = async () => {
        // Funzione per gestire il click sul pulsante like

        try {
            // Tenta di inviare la richiesta

            const token = localStorage.getItem('token');
            // Recupera il token dal localStorage

            if (!token) return;
            // Se non c'è token (utente non autenticato), esce dalla funzione

            const response = await axios.post(
                `http://localhost:3000/api/posts/${_id}/like`,
                // URL per l'endpoint di like, con l'ID del post
                {},
                // Corpo della richiesta vuoto (non servono dati aggiuntivi)
                { headers: { 'Authorization': `Bearer ${token}` } }
                // Header di autorizzazione
            );

            if (response.data) {
                // Se la risposta contiene dati

                setLikesCount(response.data.likes);
                // Aggiorna il conteggio dei like

                setIsLiked(response.data.isLiked);
                // Aggiorna lo stato liked/unliked
            }
        } catch (error) {
            // Gestisce eventuali errori

            console.error('Error liking post:', error);
            // Logga l'errore nella console
        }
    };

    const handleCommentAdded = (newComment) => {
        // Funzione chiamata quando viene aggiunto un nuovo commento

        setPostComments([...postComments, newComment]);
        // Aggiorna lo stato dei commenti aggiungendo il nuovo commento all'array
    };

    // Format date to be more readable
    const formatDate = (dateString) => {
        // Funzione per formattare la data in modo più leggibile

        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        // Opzioni per la formattazione della data

        return new Date(dateString).toLocaleDateString(undefined, options);
        // Converte la stringa in un oggetto Date e lo formatta secondo le opzioni specificate
    };

    return (
        <div className="post">
            {/* Contenitore principale del post */}

            <div className="post-header">
                {/* Intestazione del post con autore e data */}

                <div className="post-author-info">
                    {/* Contenitore per informazioni sull'autore con avatar */}

                    <img
                        src={user?.avatar || '/path/to/default-avatar.png'}
                        alt={`Avatar di ${user?.username}`}
                        className="avatar-image"
                    />
                    <span className="post-author">
                        {author?.username || 'Utente Sconosciuto'}
                        {/* Mostra il nome utente dell'autore o "Utente Sconosciuto" se non disponibile */}
                    </span>
                </div>

                <span className="post-date">
                    {formatDate(createdAt)}
                    {/* Mostra la data formattata */}
                </span>
            </div>

            <div className="post-content">
                {/* Contenuto principale del post */}

                {description}
                {/* Mostra la descrizione/testo del post */}
            </div>

            {tags && tags.length > 0 && (
                // Se ci sono tag, mostra la sezione tag

                <div className="post-tags">
                    {/* Contenitore per i tag */}

                    {tags.map((tag, index) => (
                        // Itera su ogni tag nell'array

                        <span key={index} className="tag">#{tag}</span>
                        // Renderizza ogni tag con un # davanti
                    ))}
                </div>
            )}

            <div className="post-actions">
                {/* Sezione per le azioni sul post (like, commenti) */}

                <button
                    className={`action-button ${isLiked ? 'liked' : ''}`}
                    // Classe condizionale: aggiunge 'liked' se l'utente ha messo like

                    onClick={handleLike}
                    // Associa la funzione handleLike al click

                    aria-label={isLiked ? "Rimuovi Mi piace" : "Mi piace"}
                // Etichetta per l'accessibilità
                >
                    <span className="button-text">Mi piace</span>
                    {/* Testo del pulsante */}

                    {isLiked ? (
                        // Se l'utente ha messo like

                        <FaHeart className="action-icon" />
                        // Mostra l'icona cuore pieno
                    ) : (
                        // Se l'utente non ha messo like

                        <FaRegHeart className="action-icon" />
                        // Mostra l'icona cuore vuoto
                    )}

                    <span className="count-badge">{likesCount}</span>
                    {/* Mostra il conteggio dei like */}
                </button>

                <button
                    className="action-button"
                    onClick={() => setShowComments(!showComments)}
                // Toggle della visibilità dei commenti
                >
                    <span className="button-text">Commenti</span>
                    {/* Testo del pulsante */}

                    <FaComment className="action-icon" />
                    {/* Icona commenti */}

                    <span className="count-badge">{postComments.length}</span>
                    {/* Mostra il numero di commenti */}
                </button>
            </div>

            {showComments && (
                // Se showComments è true, mostra la sezione commenti

                <div className="comments-container">
                    {/* Contenitore per i commenti */}

                    <Comments comments={postComments} />
                    {/* Renderizza il componente Comments passando l'array dei commenti */}

                    <AddComment postId={_id} onCommentAdded={handleCommentAdded} />
                    {/* Renderizza il form per aggiungere commenti, passando l'ID del post e la callback */}
                </div>
            )}
        </div>
    );
};

export default Post;
// Esporta il componente Post per poterlo utilizzare in altri file
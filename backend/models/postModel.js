const mongoose = require("mongoose");
// Importa Mongoose per interagire con MongoDB e definire schemi

const PostSchema = mongoose.Schema({
    // Definisce lo schema per il modello Post

    author: {
        type: mongoose.Schema.Types.ObjectId,
        // Campo di tipo ObjectId (riferimento a un altro documento)
        ref: 'User',
        // Riferimento al modello User
        required: true
        // Campo obbligatorio
    },

    description: {
        type: String,
        // Campo di tipo stringa
        maxLength: 1000
        // Lunghezza massima di 1000 caratteri
    },

    imgURL: String,
    // Campo opzionale per l'URL dell'immagine (tipo abbreviato)

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        // Array di ObjectId
        ref: 'User'
        // Ogni elemento fa riferimento a un User
    }],

    comments: [{
        // Array di oggetti commento incorporati
        user: {
            type: mongoose.Schema.Types.ObjectId,
            // ID dell'utente che ha scritto il commento
            ref: 'User'
            // Riferimento al modello User
        },
        text: String,
        // Testo del commento
        createdAt: {
            type: Date,
            // Data di creazione
            default: Date.now
            // Valore predefinito: data corrente
        }
    }],

    tags: [String],
    // Array di stringhe per i tag

    location: String,
    // Campo opzionale per la posizione (tipo abbreviato)

    createdAt: {
        type: Date,
        // Campo di tipo data
        default: Date.now
        // Valore predefinito: data corrente
    }
}, { timestamps: true });
// Aggiunge timestamps automatici (createdAt e updatedAt)

module.exports = mongoose.model("Post", PostSchema);
// Crea e esporta il modello 'Post' basato sullo schema definito
require("dotenv").config();
// Carica le variabili d'ambiente dal file .env nel process.env

const express = require("express");
// Importa il framework Express per la creazione del server

const mongoose = require("mongoose");
// Importa Mongoose, libreria per interagire con MongoDB

const cors = require("cors");
// Importa CORS (Cross-Origin Resource Sharing) per gestire le richieste da domini diversi

const userRoutes = require("./routes/usersRoutes");
// Importa le rotte per la gestione degli utenti

const postRoutes = require("./routes/postRoutes");
// Importa le rotte per la gestione dei post

const notificationsRoutes = require("./routes/notificationsRoutes");

const app = express();
// Inizializza l'applicazione Express

app.use(express.json());
// Middleware che analizza il corpo delle richieste con content-type application/json

app.use(
    cors({
        origin: "http://localhost:5173",
        // Specifica l'origine consentita (il frontend in sviluppo su Vite)
        credentials: true,
        // Permette l'invio di credenziali (cookie) nelle richieste cross-origin
    }),
);
// Abilita CORS con le opzioni specificate

app.use("/api/users", userRoutes);
// Collega le rotte degli utenti al percorso /api/users

app.use("/api/posts", postRoutes);
// Collega le rotte dei post al percorso /api/posts

app.use("/api/notifications", notificationsRoutes);

mongoose
    .connect(process.env.MONGODB_URI)
    // Connette all'istanza MongoDB usando l'URI specificato nelle variabili d'ambiente
    .then(() => console.log("Connected to MongoDB"))
    // Se la connessione ha successo, stampa un messaggio di conferma
    .catch((err) => console.error("MongoDB connection error:", err));
// Se la connessione fallisce, stampa l'errore

const PORT = process.env.PORT || 3000;
// Definisce la porta su cui il server ascolterà, usando quella specificata nelle variabili d'ambiente o 3000 come fallback

// Avvio Server
app.listen(PORT, '0.0.0.0', () => {
    // Avvia il server HTTP in ascolto su tutte le interfacce di rete
    console.log(`Server in ascolto su porta ${PORT}`);
    // Stampa un messaggio di conferma con la porta utilizzata
}).on('error', (err) => {
    // Registra un listener per gli errori durante l'avvio del server
    console.error('Errore durante l\'avvio del server:', err);
    // Stampa l'errore se si verifica
});
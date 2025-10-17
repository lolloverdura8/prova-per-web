const jwt = require("jsonwebtoken");
// Importa la libreria jsonwebtoken per la gestione dei token JWT
require("dotenv").config();
// Carica le variabili d'ambiente dal file .env nel process.env

module.exports = (req, res, next) => {
    // Definisce un middleware di autenticazione che accetta req (richiesta), res (risposta) e next (funzione per passare al middleware successivo)

    // const token = req.header('Authorization')?.replace('Bearer ', '');
    // Estrae l'header Authorization dalla richiesta e rimuove la parte "Bearer "
    const token = req.cookies.token;

    if (!token) {
        // Se il token non esiste

        console.error("Token mancante");
        // Stampa un messaggio di errore nella console

        return res.status(401).json({ message: 'No token' });
        // Risponde con stato 401 (Unauthorized) e un messaggio di errore
    }
    try {
        // Tenta di verificare il token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Verifica la validità del token usando la chiave segreta definita nelle variabili d'ambiente

        req.user = decoded;
        // Aggiunge i dati dell'utente (contenuti nel token) all'oggetto request

        next();
        // Passa al middleware o controller successivo
    } catch (err) {
        // Se la verifica fallisce (token scaduto o non valido)

        console.error("Token non valido:", err);
        // Stampa un messaggio di errore nella console

        res.status(401).json({ message: 'Invalid token' });
        // Risponde con stato 401 (Unauthorized) e un messaggio di errore
    }
};
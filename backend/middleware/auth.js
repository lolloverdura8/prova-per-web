const jwt = require("jsonwebtoken");
// Importa la libreria jsonwebtoken per la gestione dei token JWT

const auth = (req, res, next) => {
    // Definisce un middleware di autenticazione che accetta req (richiesta), res (risposta) e next (funzione per passare al middleware successivo)

    const authHeader = req.header("Authorization");
    // Estrae l'header Authorization dalla richiesta

    if (!authHeader) return res.status(401).json({ message: "Accesso negato, token mancante." });
    // Se l'header non esiste, risponde con stato 401 (Unauthorized) e un messaggio di errore

    // Verifica se il token inizia con "Bearer " e lo estrae
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        // Se inizia con "Bearer ", estrae il token rimuovendo i primi 7 caratteri
        : authHeader;
    // Altrimenti usa l'intero header come token

    try {
        // Tenta di verificare il token

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Verifica la validità del token usando la chiave segreta definita nelle variabili d'ambiente

        req.user = verified;
        // Aggiunge i dati dell'utente (contenuti nel token) all'oggetto request

        next();
        // Passa al middleware o controller successivo
    } catch (err) {
        // Se la verifica fallisce (token scaduto o non valido)

        res.status(400).json({ message: "Token non valido." });
        // Risponde con stato 400 (Bad Request) e un messaggio di errore
    }
};

module.exports = auth;
// Esporta il middleware di autenticazione per poterlo utilizzare in altri file
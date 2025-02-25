const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Accesso negato, token mancante." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Assicurati che JWT_SECRET sia definito nel tuo file .env
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Token non valido." });
    }
};

module.exports = auth;
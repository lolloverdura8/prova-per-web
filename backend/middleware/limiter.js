const limiter = require('express-rate-limit');

const apiLimiter = limiter({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // Limita ogni IP a 100 richieste per windowMs
    message: 'Troppi tentativi da questo IP, riprova più tardi.'
});

module.exports = apiLimiter;
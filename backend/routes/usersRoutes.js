const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const auth = require('../middleware/auth');

// Registrazione
router.post('/register', userController.register);

// Login
router.post('/login', async (req, res, next) => {
    try {
        console.log("Tenativo di login:", req.body);
        await userController.login(req, res);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error during login", details: error.message });
    }
}
);

// Ottieni profilo utente (richiede autenticazione)
router.get('/profile', auth, userController.getProfile);

// Aggiorna profilo utente (richiede autenticazione)
router.put('/profile', auth, userController.updateProfile);

// Logout
router.post('/logout', auth, userController.logout);

module.exports = router;
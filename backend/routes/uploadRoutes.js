const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Rotta per caricare l'avatar (richiede autenticazione)
router.post('/avatar', auth, upload.single('avatar'), uploadController.uploadAvatar);

// Rotta per servire l'avatar di un utente
router.get('/avatar/:id', userController.getAvatar);

module.exports = router;
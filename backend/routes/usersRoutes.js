const express = require('express');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const User = require('../models/User');
const userController = require('../controllers/userController')
const router = express.Router();


// Registrazione
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

router.get('/', userController.checkuser);

module.exports = router;
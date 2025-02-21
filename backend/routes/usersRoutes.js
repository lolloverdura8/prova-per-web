const express = require('express');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const User = require('../models/User');
const userController = require('../controllers/userController')
const router = express.Router();


// Registrazione
router.get('/register', userController.register);

// router.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
//     try {
//         const newUser = new User({ username, email, password });
//         await newUser.save();
//         res.status(201).json({ message: 'Utente registrato' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });



// Login
router.get('/login', userController.login);

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !await bcrypt.compare(password, user.password)) {
//             return res.status(400).json({ message: 'Credenziali errate' });
//         }
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token, user });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

module.exports = router;

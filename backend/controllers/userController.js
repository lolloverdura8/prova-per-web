const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = {
    register: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            const newUser = new User({ username, email, password });
            await newUser.save();
            res.status(201).json({ message: "Utente registrato" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: "Credenziali errate" });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.json({ token, user });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    checkuser: async (req, res) => {
        try {
            const users = await User.find({}, { password: 0 });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password'); // Get user data without password
            if (!user) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

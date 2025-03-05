const User = require('../models/userModel');

module.exports = {
    // Carica avatar utente
    uploadAvatar: async (req, res) => {
        try {
            // Verifica se è stato caricato un file
            if (!req.file) {
                return res.status(400).json({ message: "Nessun file caricato" });
            }

            // Aggiorna l'avatar dell'utente nel database
            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    avatar: {
                        data: req.file.buffer,  // Dati binari dell'immagine
                        contentType: req.file.mimetype  // Tipo MIME
                    }
                },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            // Non inviamo i dati binari dell'immagine nella risposta per evitare payload pesanti
            // Inviamo invece un URL temporaneo o un flag che indica che l'avatar è disponibile
            const userWithoutAvatarData = {
                ...user.toObject(),
                avatar: user.avatar ? `/api/users/avatar/${user._id}` : null
            };

            res.json({
                success: true,
                user: userWithoutAvatarData
            });
        } catch (err) {
            console.error("Errore durante l'upload dell'avatar:", err);
            res.status(500).json({ error: err.message });
        }
    },

    // Serve l'avatar di un utente
    getAvatar: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user || !user.avatar || !user.avatar.data) {
                // Se l'utente non ha un avatar, invia un avatar predefinito
                return res.status(404).json({ message: "Avatar non trovato" });
            }

            // Imposta gli header MIME appropriati
            res.contentType(user.avatar.contentType);

            // Invia i dati binari dell'immagine
            return res.send(user.avatar.data);
        } catch (err) {
            console.error("Errore nel recupero dell'avatar:", err);
            res.status(500).json({ error: err.message });
        }
    }
};
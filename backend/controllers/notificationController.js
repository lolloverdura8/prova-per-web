const mongoose = require("mongoose");
const Notification = require('../models/notificationModel');

module.exports = {
    async getUserNotifications(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await Notification.find({
                userId: new mongoose.Types.ObjectId(userId)
            })
                .populate('actorId', 'username')
                .populate('postId', '_id')
                .sort({ createdAt: -1 });

            res.status(200).json(notifications);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async markNotificationAsRead(req, res) {
        try {
            const notificationId = req.params.id; // <-- correzione: req.params.id, non destrutturare
            const userId = req.user.id; // <-- usa sempre .id

            const notification = await Notification.findOneAndUpdate(
                { _id: notificationId, userId: mongoose.Types.ObjectId(userId) },
                { isRead: true },
                { new: true }
            );

            if (!notification) {
                return res.status(404).json({ message: "Notifica non trovata" });
            }

            res.status(200).json(notification);

        } catch (error) {
            console.error("Errore nel marcare la notifica come letta:", error);
            res.status(500).json({ message: "Errore interno del server" });
        }
    },

    async markAllNotificationsAsRead(req, res) {
        try {
            const userId = req.user.id;
            await Notification.updateMany(
                { userId: new mongoose.Types.ObjectId(userId), isRead: false },
                { $set: { isRead: true } }
            );
            res.status(200).json({ message: "Notifiche segnate come lette" });
        } catch (error) {
            res.status(500).json({ message: "Errore interno" });
        }
    }

}
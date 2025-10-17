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
    },


}
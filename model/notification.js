const mongoose = require("mongoose")
const NotificationSchema = new mongoose.Schema({
    token: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
}, { timestamps: true })

module.exports = {
    NotificationModel: mongoose.model('Notification', NotificationSchema),
}
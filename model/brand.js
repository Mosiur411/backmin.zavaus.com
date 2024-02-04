const mongoose = require("mongoose")
const BrandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Employee'
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    images: {
        type: String,
        trim: true,
    },
}, { timestamps: true })

module.exports = {
    BrandModel: mongoose.model('Brand', BrandSchema),
}

const mongoose = require("mongoose")
const SubChildCategorieSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    development_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Development',
        required: true
    },
    categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    sub_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategorie',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'User'
    },
    images: {
        type: String,
        trim: true,
    },

}, { timestamps: true })
module.exports = {
    SubChildCategorieModel: mongoose.model('ChildSubcategorie', SubChildCategorieSchema),
}
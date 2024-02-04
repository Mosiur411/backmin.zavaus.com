const mongoose = require("mongoose")
const ShrinkageSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Product'
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Employee'
    },
    sales_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'order'
    },
    quantity: {
        type: Number,
        trim: true,
    },
    cost: {
        type: Number,
        trim: true,
    },
    saleing_Price: {
        type: Number,
        trim: true,
    },
}, { timestamps: true })



module.exports = {
    ShrinkageModel: mongoose.model('Shrinkage', ShrinkageSchema),
}
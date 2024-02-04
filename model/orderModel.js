const mongoose = require('mongoose');

const singleSelectFlSchema = new mongoose.Schema({
    id: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    item: {
        type: Number,
        trim: true,
        required: true,
    },
});

const singlePalanSelectSchema = new mongoose.Schema({
    item: {
        type: Number,
        trim: true,
        required: true,
    },
    prices: {
        type: Number,
        trim: true,
        required: true,
    },
    index: {
        type: String,
        trim: true,
    },
});

const singleItemsSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Product',
    },
    product_name: {
        type: String,
        trim: true,
        required: true,
    },
    singlePrices: {
        type: Number,
        trim: true,
        required: true,
    },
    selectFl: [singleSelectFlSchema],
    palanSelect: [singlePalanSelectSchema],
});

const OrderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            required: true,
            ref: 'User',
        },
        prices: {
            type: Number,
            trim: true,
            required: true,
        },
        quantity: {
            type: Number,
            trim: true,
            required: true,
        },
        paymentmethods: {
            type: String,
            trim: true,
            required: true,
        },
        role: {
            type: String,
            trim: true,
            enum: ['wholesale', 'retailer', 'consumer'],
            required: true,
        },
        orderId: {
            type: String,
            trim: true,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'shipping', 'delivered'],
            default: 'pending',
        },
        cartItems: [singleItemsSchema],
        shipping_name: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_last_name: {
            type: String,
            trim: true,
        },
        shipping_company_name: {
            type: String,
            trim: true,
        },
        shipping_address: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_city: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_state: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_zip_code: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_country: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_number: {
            type: String,
            trim: true,
            required: true,
        },
        shipping_email: {
            type: String,
            trim: true,
            required: true,
        },

    },
    { timestamps: true }
);

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;

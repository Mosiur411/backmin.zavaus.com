
const mongoose = require("mongoose")

const ffers = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
    },
    offer: {
        type: mongoose.Schema.Types.Mixed,
        trim: true,
    },
    amount: {
        type: Number,
        trim: true,
    },
})
const sales_offer = new mongoose.Schema({
    status: {
        type: Boolean,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
    offer: {
        type: mongoose.Schema.Types.Mixed,
        trim: true,
    },
    amount: {
        type: Number,
        trim: true,
    },
    color: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        trim: true,
    },
})

const deals_offer_item = new mongoose.Schema({
    prices: {
        type: Number,
        trim: true,
    },
    item: {
        type: Number,
        trim: true,
    },
})

const deals_offer = new mongoose.Schema({
    status: {
        type: Boolean,
        trim: true,
    },
    title: {
        type: String,
        trim: true,
    },
    items: [deals_offer_item]
})

const productImages = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    image: [
        {
            type: String,
            trim: true
        }
    ],
    imagesTitle: {
        type: String,
        trim: true,
    },
    imageAlterText: {
        type: String,
        trim: true,
    },
})
const productPrices = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        trim: true
    },
})

const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
    },
    pcs: {
        type: Number,
        trim: true,
        required: true,
    },
    upc: {
        type: String,
        trim: true,
    },
    sku: {
        type: String,
        trim: true,
    },
    upcBox: {
        type: String,
        trim: true,
    },
    cost: {
        type: Number,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Employee'
    },
    development_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Development',
    },
    categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorie',
    },
    sub_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategorie',
    },
    childSub_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChildSubcategorie',
    },
    brand_id: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        trim: true,
        default: false,
    },
    unitGross: {
        type: Number,
        trim: true,
    },
    quantity: {
        type: Number,
        trim: true,
    },
    /* ============== */
    images: [productImages],

    saleing_Price: {
        type: Number,
        trim: true,
    },
    price: [productPrices],
    retailer_saleing_Price: {
        type: Number,
        trim: true,
    },
    retailer_price: [productPrices],
    wholesaler_saleing_Price: {
        type: Number,
        trim: true,
    },
    wholesaler_price: [productPrices],
    consumer_saleing_Price: {
        type: Number,
        trim: true,
    },
    consumer_price: [productPrices],
    tag: {
        type: String,
        trim: true,
    },
    meta_title: {
        type: String,
        trim: true,
    },
    meta_description: {
        type: String,
        trim: true,
    },

    /*  */
    product_type_popular: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    product_type_topSelling: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    product_type_trending: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    product_type_deals_of_day: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    product_type_featured: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    product_type_rated: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    product_type_dailybestsells: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },

    sale_retailer: [sales_offer],
    sale_wholesaler: [sales_offer],
    sale_consumer: [sales_offer],
    consumer_deals: [deals_offer],
    wholesaler_deals: [deals_offer],
    retailer_deals: [deals_offer],

    coupon: [ffers],
    promo: [ffers],
    deal: [ffers],
    description: {
        type: String,
        trim: true,
    },
    product_ditails: {
        type: String,
        trim: true,
    },
    totalItems: {
        type: Number,
        trim: true,
        required: true,
        default: 0
    },
    stock: {
        type: Number,
        trim: true,
    },
    consumer_status: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    retailer_status: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },
    wholesaler_status: {
        type: Boolean,
        trim: true,
        required: true,
        default: false,
    },

}, { timestamps: true })
module.exports = {
    ProductModel: mongoose.model('Product', ProductSchema),
}

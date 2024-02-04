const { default: mongoose } = require("mongoose");
const { errorMessageFormatter, getDataFromCsv } = require("../../utils/helpers");
const { ProductModel } = require("../../model/product/product.model");
const { validateObjectId } = require("../../utils/validators");
const { doesDepartmentExist } = require("./development.controller");
const { PurchasesModel } = require("../../model/purchase");
const { SendPushNotificationToMultiple } = require("../../middleware/sendPushNotification");
const { notificationToken } = require("../user.controller");


const addProduct = async (req, res) => {
    try {
        const data = req.body;
        if (data?.development_id == '') {
            delete data?.development_id;
        }
        if (data?.categorie_id == '') {
            delete data?.categorie_id;
        }
        if (data?.sub_id == '') {
            delete data?.sub_id;
        }
        if (data?.childSub_id == '') {
            delete data?.childSub_id;
        }

        const product = await ProductModel({ ...data, user: req.user._id })
        if (!product) res.status(404).json({ message: "Not Found" })

        if (product) {
            product.stock = await product?.quantity
            product.totalItems = await product?.quantity * product?.pcs
            await product.save();
            const token = await notificationToken()
            const body = product?.product_name;
            const websiteURL = `https://zavawholesale.com/${product?.slug}`;
            const imageUrl = product?.images[0]?.image[0];
            SendPushNotificationToMultiple(token, 'New Product', body, imageUrl, websiteURL)

            return res.status(201).json({ product })

        } else {
            return res.status(500).json({ product })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* ==================== add bulk product ============  */

const getValidProducts = async (productsFromCSV) => {
    const validProducts = []
    const errors = []

    for (idx in productsFromCSV) {
        try {
            const isValidId = validateObjectId(productsFromCSV[idx].development_id)
            if (!isValidId) {
                errors.push(`Depatrment: ${productsFromCSV[idx].development_id} does not exists`)
                continue
            }

            const isDepartment = await doesDepartmentExist(productsFromCSV[idx].development_id)
            if (!isDepartment) {
                errors.push(`Depatrment: ${productsFromCSV[idx].department} does not exists`)
                continue
            }

            validProducts.push(productsFromCSV[idx])
        } catch (err) {
            //console.log(err)
            errors.push(err.message)
        }
    }

    return { validProducts, errors }
}

const addBulkProduct = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: '"products_csv" is required.' })
        const productsFromCSV = await getDataFromCsv(file.path, req.user._id)
        const { validProducts, errors } = await getValidProducts(productsFromCSV)
        const products = await ProductModel.insertMany(validProducts)
        return res.status(201).json({ products, errors })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getProduct = async (req, res) => {
    const { _id } = req.query
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    try {
        if (_id) {
            const product = await ProductModel.findById(_id).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
            return res.status(200).json({ product })
        }
        const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        const search = new RegExp(sanitizedSearchQuery, 'i');
        const totalProduct = await ProductModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        if (searchQuery && search) {
            const product = await ProductModel.find({
                "$or": [{ product_name: { $regex: search } }, { upc: { $regex: search } }, { upcBox: { $regex: search } }]
            }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user']).sort({ _id: -1 }).skip(skip).limit(limit)
            totalPages = product.length;
            return res.status(200).json({ product, totalPages })
        }
        const product = await ProductModel.find({}).sort({ _id: -1 }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user']).skip(skip).limit(limit)
        return res.status(201).json({ product, totalPages })

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const updateProduct = async (req, res) => {
    try {
        let product;
        const data = req.body;
        if (data?.development_id == '') {
            delete data?.development_id;
        }
        if (data?.categorie_id == '') {
            delete data?.categorie_id;
        }
        if (data?.sub_id == '') {
            delete data?.sub_id;
        }
        if (data?.childSub_id == '') {
            delete data?.childSub_id;
        }
        const { _id } = req.query;
        if (!_id) return res.status(400).json({ Message: 'Product  Not select ' });
        if (data?.quantity_action === '+') {
            data.quantity = Number(data.quantity) + Number(data?.new_quantity)
            data.stock = Number(data.stock) + Number(data?.new_quantity)
            data.totalItems = Number(data.quantity * data?.pcs)

        }
        if (data?.quantity_action === '-') {
            console.log(data.new_quantity)
            data.quantity = Number(data.quantity) - Number(data?.new_quantity)
            if (!data.quantity) {
                return res.status(400).json({ message: 'New quantity Not accept' })
            }
            data.stock = Number(data.stock) - Number(data?.new_quantity)
            if (!data.stock) {
                return res.status(400).json({ message: 'New quantity Not accept' })
            }
            data.totalItems = Number(data.quantity * data?.pcs)

        }
        product = await ProductModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
        const token = await notificationToken()
        const body = product?.product_name;
        const websiteURL = `https://zavawholesale.com/${product?.slug}`;
        const imageUrl = product?.images[0]?.image[0];
        SendPushNotificationToMultiple(token, 'Product Update', body, imageUrl, websiteURL)
        return res.status(201).json({ product })


    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }




}

const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.query;
        const product = await ProductModel.deleteOne({ _id: _id })
        return res.status(201).json({ product })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* =================== product type handel ===================  */
const prodcutTypeHandle = async (req, res) => {
    try {
        const { _id } = req.query;
        const bodyData = req.body;
        delete bodyData?._id;
        const result = await ProductModel.findOneAndUpdate({ _id }, { ...bodyData }, { new: true })
        return res.status(201).json(result)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const popularProduct = async (req, res) => {
    const Popular = await ProductModel.find({ product_type_popular: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(Popular)
}
const topSellingProduct = async (req, res) => {
    const topSelling = await ProductModel.find({ product_type_topSelling: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(topSelling)
}
const trendingProduct = async (req, res) => {
    const Trending = await ProductModel.find({ product_type_trending: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(Trending)
}
const dealsofdayProduct = async (req, res) => {
    const Dealsofday = await ProductModel.find({ product_type_deals_of_day: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(Dealsofday)
}
const featuredProduct = async (req, res) => {
    const Featured = await ProductModel.find({ product_type_featured: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(Featured)
}
const topRatedProduct = async (req, res) => {
    const Featured = await ProductModel.find({ product_type_rated: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(Featured)
}
const dailybestsellsProduct = async (req, res) => {
    const Featured = await ProductModel.find({ product_type_dailybestsells: true }).populate(['development_id', 'categorie_id', 'sub_id', 'childSub_id', 'user'])
    return res.status(200).json(Featured)
}

module.exports = { addProduct, getProduct, updateProduct, deleteProduct, addBulkProduct, prodcutTypeHandle, popularProduct, topSellingProduct, trendingProduct, trendingProduct, dealsofdayProduct, featuredProduct, topRatedProduct, dailybestsellsProduct }
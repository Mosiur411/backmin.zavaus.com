const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { ProductModel } = require("../model/product/product.model");
const OrderModel = require("../model/orderModel");
const productModel = require("../model/product/product.model");
const SalesModel = require("../model/sales.model");



const getOnlineOrder = async (req, res) => {
    try {
        const query = req?.query;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.search;
        const role = req.query.role;
        if (!query || !role) return res.status(401).json({ message: false })
        /* =============== search wuery  ===============  */
        const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        const search = new RegExp(sanitizedSearchQuery, 'i');
        const totalProduct = await OrderModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        const onlineOrder = await OrderModel.find({
            role: role,
            status: { $nin: ['delivered'] }
        })
            .populate({
                path: 'user_id',
                select: 'email name',
            })
            .select('orderId prices status createdAt')
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        return res.status(201).json({ onlineOrder, totalPages })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const statusUpdateOnlineOrder = async (req, res) => {
    try {
        let checkProduct = null;
        const _id = req.query;
        const data = req.body;
        if (!_id) return res.status(400).json({ message: "Missing _id parameter" });
        const getOrderData = await OrderModel.findById(_id);

        if (data?.status === 'delivered') {
            if (!getOrderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            const cartItems = getOrderData.cartItems;
            for (const item of cartItems) {
                const product = await ProductModel.findById(item._id).select('quantity pcs totalItems product_name');
                if (!product) {
                    return res.status(404).json({ message: "Order not found" });
                }
                const { pcs, quantity, totalItems, product_name } = product;

                const quantityCount = item?.selectFl.reduce((total, data) => total + (data.item || 0), 0);
                const productOldItem = quantityCount * pcs;

                if (totalItems >= productOldItem && quantity >= quantityCount) {
                    checkProduct = true
                } else {
                    return res.status(404).json({ message: `I dont have that many products ${product_name}` });
                }
            }
        } else {
            if (!getOrderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            const cartItems = getOrderData.cartItems;
            for (const item of cartItems) {
                const product = await ProductModel.findById(item._id).select('quantity pcs totalItems product_name');
                if (!product) {
                    return res.status(404).json({ message: "Order not found" });
                }
                const { pcs, quantity, totalItems, product_name } = product;

                const quantityCount = item?.selectFl.reduce((total, data) => total + (data.item || 0), 0);
                const productOldItem = quantityCount * pcs;
                if (totalItems >= productOldItem && quantity >= quantityCount) {
                    checkProduct = true
                } else {
                    return res.status(404).json({ message: `I dont have that many products ${product_name}` });
                }
            }
            if (checkProduct) {
                const result = await OrderModel.findOneAndUpdate({ _id }, { ...data }, { new: true });
                return res.status(200).json({ result });
            }
        }
        if (checkProduct) {
            if (!getOrderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            const cartItems = getOrderData.cartItems;

            for (const item of cartItems) {
                const product = await ProductModel.findById(item._id).select('quantity pcs totalItems product_name');
                if (!product) {
                    return res.status(404).json({ message: "Order not found" });
                }
                const { pcs, quantity, totalItems, product_name } = product;
                const quantityCount = item?.selectFl.reduce((total, data) => total + (data.item || 0), 0);
                if (getOrderData !== 'consumer') {
                    await ProductModel.findByIdAndUpdate(item._id, {
                        $inc: { quantity: -quantityCount, totalItems: -quantityCount * pcs }
                    });
                } else {
                    const incQnt = quantityCount / pcs;
                    await ProductModel.findByIdAndUpdate(item._id, {
                        $inc: { quantity: -incQnt, totalItems: -quantityCount }
                    });
                }
            }
            const addSales = {
                user_id: getOrderData?.user_id,
                trxID: getOrderData?.trxID,
                subtotal: getOrderData?.subtotal,
                shaping_rate: getOrderData?.shaping_rate,
                prices: getOrderData?.prices,
                quantity: getOrderData?.quantity,
                paymentmethods: getOrderData?.paymentmethods,
                role: getOrderData?.role,
                status: 'delivered',
                cartItems: getOrderData?.cartItems,
                shipping_name: getOrderData?.shipping_name,
                shipping_address: getOrderData?.shipping_address,
                shipping_city: getOrderData?.shipping_city,
                shipping_state: getOrderData?.shipping_state,
                shipping_zip_code: getOrderData?.shipping_zip_code,
                shipping_number: getOrderData?.shipping_number,
                shipping_email: getOrderData?.shipping_email,
                shipping_country: getOrderData?.shipping_country,
                orderId: getOrderData?.orderId,
            }
            const sales = new SalesModel(addSales);
            sales.save()
            await OrderModel.deleteOne({ _id: _id })
            return res.status(200).json({ message: "Order status updated" });
        }

    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json({ error: errorMessage });
    }
}

const deleteOnlineOder = async (req, res) => {
    try {
        const _id = req.query
        if (!_id) return res.status(401).json({ message: false })
        const result = await OrderModel.deleteOne({ _id: _id })
        return res.status(200).json({ result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


const singleOnlineOderView = async (req, res) => {
    try {
        const _id = req.query
        if (!_id) return res.status(401).json({ message: false })
        const result = await OrderModel.findOne({ _id: _id })
        return res.status(200).json({ result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { getOnlineOrder, statusUpdateOnlineOrder, deleteOnlineOder, singleOnlineOderView }

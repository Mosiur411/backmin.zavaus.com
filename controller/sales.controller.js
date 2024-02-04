const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const SalesModel = require("../model/sales.model");



const getSales = async (req, res) => {
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
        const totalProduct = await SalesModel.countDocuments({ role: role });
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        const onlineOrder = await SalesModel.find({
            role: role,
            status: 'delivered'
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

/*     
         // const updateData = {
        //     stock: 0,
        //     totalItems: 0,
        //     quantity: 0,
        // };
        // const updateResult = await ProductModel.updateMany({}, { $set: updateData });
        // res.json({ message: 'All products updated successfully', updateResult });
        
        
        */


/* const statusUpdateSales = async (req, res) => {
    try {
        let checkProduct = null;
        const _id = req.query;
        const data = req.body;
        if (!_id) return res.status(400).json({ message: "Missing _id parameter" });
        const getOrderData = await SalesModel.findById(_id);
        if (data?.status === 'delivered') {
            if (!getOrderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            const cartItems = getOrderData.cartItems;
            for (const item of cartItems) {
                const product = await ProductModel.findById(item._id).select('quantity pcs totalItems');
                if (!product) {
                    return res.status(404).json({ message: "Order not found" });
                }
                const { pcs, quantity, totalItems } = product;

                const quantityCount = item?.selectFl.reduce((total, data) => total + (data.item || 0), 0);
                const productOldItem = quantityCount * pcs;

                if (totalItems >= productOldItem && quantity >= quantityCount) {
                    checkProduct = true
                } else {
                    return res.status(404).json({ message: "I dont have that many products" });
                }
            }
        } else {
            if (!getOrderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            const cartItems = getOrderData.cartItems;

            for (const item of cartItems) {
                const product = await ProductModel.findById(item._id).select('quantity pcs totalItems');
                if (!product) {
                    return res.status(404).json({ message: "Order not found" });
                }
                const { pcs, quantity, totalItems } = product;

                const quantityCount = item?.selectFl.reduce((total, data) => total + (data.item || 0), 0);
                const productOldItem = quantityCount * pcs;
                if (totalItems >= productOldItem && quantity >= quantityCount) {
                    checkProduct = true
                } else {
                    return res.status(404).json({ message: "I dont have that many products" });
                }
            }
            if (checkProduct) {
                const result = await SalesModel.findOneAndUpdate({ _id }, { ...data }, { new: true });
                return res.status(200).json({ result });
            }
        }
        if (checkProduct) {
            if (!getOrderData) {
                return res.status(404).json({ message: "Order not found" });
            }
            const cartItems = getOrderData.cartItems;

            for (const item of cartItems) {
                const product = await ProductModel.findById(item._id).select('quantity pcs totalItems');
                if (!product) {
                    return res.status(404).json({ message: "Order not found" });
                }
                const { pcs, quantity, totalItems } = product;
                const quantityCount = item?.selectFl.reduce((total, data) => total + (data.item || 0), 0);
                if (getOrderData !== 'consumer') {
                    await ProductModel.findByIdAndUpdate(item._id, {
                        $inc: { quantity: -quantity, totalItems: -quantityCount * pcs }
                    });
                } else {
                    const incQnt = quantityCount / pcs;
                    await ProductModel.findByIdAndUpdate(item._id, {
                        $inc: { quantity: -incQnt, totalItems: -quantityCount }
                    });
                }
            }
            const result = await SalesModel.findOneAndUpdate({ _id }, { ...data }, { new: true });
            return res.status(200).json({ result });
        }
        return res.status(200).json({ message: "Order status updated" });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json({ error: errorMessage });
    }
} */


const singleSalesView = async (req, res) => {
    try {
        const _id = req.query
        if (!_id) return res.status(401).json({ message: false })

        const result = await SalesModel.findOne({ _id: _id })
            .populate('cartItems._id')
            .populate({
                path: 'user_id',
                select: 'email name role',
            })
        return res.status(200).json({ result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { getSales, singleSalesView }

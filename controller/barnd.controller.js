const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { BrandModel } = require("../model/brand");

/* get blog */
const getBrand = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    try {
        const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        const search = new RegExp(sanitizedSearchQuery, 'i');
        const totalBlog = await BrandModel.countDocuments();
        let totalPages = Math.ceil(totalBlog / limit);
        const skip = page * limit;
        if (searchQuery && search) {
            const brand = await BrandModel.find({
                "$or": [{ title: { $regex: search } }]
            }).populate(['user']).sort({ _id: -1 }).skip(skip).limit(limit)
            totalPages = brand.length;
            return res.status(200).json({ brand, totalPages })
        }
        const brand = await BrandModel.find({}).sort({ _id: -1 }).populate(['user']).skip(skip).limit(limit)
        return res.status(201).json({ brand, totalPages })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* save  blog */
const saveBrand = async (req, res) => {
    try {
        const data = req.body;
        const user = req?.user?._id;
        const brandModalCheck = BrandModel({ ...data, user: user })
        await brandModalCheck.save()
        return res.status(201).json(brandModalCheck)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/*  update  blog*/
const updateBrand = async (req, res) => {
    try {
        const data = req?.body;
        const { _id } = req.query;
        const blog = await BrandModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
        return res.status(201).json(blog)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* delete blog */
const deleteBrand = async (req, res) => {
    try {
        const { _id } = req.query;
        const blog = await BrandModel.deleteOne({ _id: _id })
        return res.status(201).json(blog)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


/* get all brand  */

const getAllBrand = async (req, res) => {
    try {
        const brand = await BrandModel.find({})
        return res.status(201).json(brand)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { getBrand, saveBrand, updateBrand, deleteBrand, getAllBrand }

const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { BlogModel } = require("../model/blog.model");
const { SendPushNotificationToMultiple } = require("../middleware/sendPushNotification");
const { notificationToken } = require("./user.controller");

/* get blog */
const getBlog = async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    try {
        const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
        const search = new RegExp(sanitizedSearchQuery, 'i');
        const totalBlog = await BlogModel.countDocuments();
        let totalPages = Math.ceil(totalBlog / limit);
        const skip = page * limit;
        if (searchQuery && search) {
            const blog = await BlogModel.find({
                "$or": [{ title: { $regex: search } }]
            }).populate(['categorie_id']).sort({ _id: -1 }).skip(skip).limit(limit)
            totalPages = blog.length;
            return res.status(200).json({ blog, totalPages })
        }
        const blog = await BlogModel.find({}).sort({ _id: -1 }).populate(['categorie_id']).skip(skip).limit(limit)
        const blogData = await BlogModel.find({})
        const createdAtYearsSet = new Set();

        for (const blogPost of blogData) {
            const createdAt = new Date(blogPost.createdAt);
            const year = createdAt.getFullYear();
            createdAtYearsSet.add(year);
        }
        const createdAtYears = Array.from(createdAtYearsSet);
        return res.status(201).json({ blog, totalPages, createdAtYears })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* save  blog */
const saveBlog = async (req, res) => {
    try {
        const data = req.body;
        const user = req?.user?._id;
        const blogModalCheck = BlogModel({ ...data, user: user })
        await blogModalCheck.save()
        const token = await notificationToken()
        const body = blogModalCheck?.title;
        const websiteURL = `https://zavawholesale.com/${blogModalCheck?.title}`;
        const imageUrl = blogModalCheck?.images;
        SendPushNotificationToMultiple(token, 'New Blog', body, imageUrl, websiteURL)
        return res.status(201).json(blogModalCheck)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/*  update  blog*/
const updateBlog = async (req, res) => {
    try {
        const data = req?.body;
        const { _id } = req.query;
        const blog = await BlogModel.findOneAndUpdate({ _id }, { ...data }, { new: true })

        const token = await notificationToken()
        const body = blog?.title;
        const websiteURL = `https://zavawholesale.com/${blog?.title}`;
        const imageUrl = blog?.images;
        SendPushNotificationToMultiple(token, 'New Blog', body, imageUrl, websiteURL)

        return res.status(201).json(blog)

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* delete blog */
const deleteBlog = async (req, res) => {
    try {
        const { _id } = req.query;
        const blog = await BlogModel.deleteOne({ _id: _id })
        return res.status(201).json(blog)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { getBlog, saveBlog, updateBlog, deleteBlog }

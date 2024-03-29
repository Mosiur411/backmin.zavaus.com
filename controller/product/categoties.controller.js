const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { CategorieModel } = require("../../model/product/categories.model");
const { DevelopmentModel } = require("../../model/product/development.model");
const { notificationToken } = require("../user.controller");
const { SendPushNotificationToMultiple } = require("../../middleware/sendPushNotification");
/* Development create */
const addCategoties = async (req, res) => {

    try {
        const name = req.body.name;
        const development_id = req.body.development_id;
        const images = req.body.images;
        const data = { name: name, development_id: development_id, user: req.user._id, images: images }
        const categorie = await CategorieModel(data).save()
        const token = await notificationToken()
        const body = categorie?.name;
        const websiteURL = `https://zavawholesale.com/${categorie?.name}`;
        const imageUrl = categorie?.images;
        SendPushNotificationToMultiple(token, 'New Categorie', body, imageUrl, websiteURL)
        return res.status(201).json({ categorie })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}




const getCategoties = async (req, res) => {
    try {
        const query = req.query._id;
        let categorie;
        if (query) {
            categorie = await CategorieModel.find({ development_id: query }).sort({ _id: -1 })
        } else {
            categorie = await CategorieModel.find({}).sort({ _id: -1 }).populate(['development_id', 'user'])
        }
        return res.status(201).json({ categorie })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}



/* update one  */
const updateCategoties = async (req, res) => {
    const data = req.body;
    const { _id } = req.query;
    if (!_id) return res.status(400).json({ Message: 'categoties Not select ' });
    const categoties = await CategorieModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
    const token = await notificationToken()
    const body = categoties?.name;
    const websiteURL = `https://zavawholesale.com/${categoties?.name}`;
    const imageUrl = categoties?.images;
    SendPushNotificationToMultiple(token, 'Categorie Update', body, imageUrl, websiteURL)
    return res.status(201).json({ categoties });
}


const deleteCategoties = async (req, res) => {
    try {
        const { categoty_id } = req.query;
        const result = await CategorieModel.deleteMany({ _id: { $in: categoty_id } });
        return res.status(201).json({ result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}




module.exports = {
    addCategoties, getCategoties, deleteCategoties, updateCategoties
}

/*   // const result = await DevelopmentModel.aggregate([
        //     {
        //         $lookup: {
        //             from: 'categories',
        //             localField: 'category',
        //             foreignField: '_id',
        //             as: 'category'
        //         }
        //     },
        //     {
        //         $match: {
        //             'category._id': new mongoose.Types.ObjectId(categoty_id),
        //         }
        //     },
        //     {
        //         $unset: 'category'
        //     },
        //     {
        //         $unwind: '$developments'
        //     }
        // ]).then(() => CategorieModel.findByIdAndDelete(categoty_id)); */
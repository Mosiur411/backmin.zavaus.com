const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { SubChildCategorieModel } = require("../../model/product/childsub.model");
/* Development create */
const addChildSubCategoties = async (req, res) => {
    try {
        const data = req.body;
        const childSub = await SubChildCategorieModel.create({ ...data, user: req.user._id })
        return res.status(201).json({ childSub })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getChildSubCategoties = async (req, res) => {
    try {
        const query = req.query._id;
        let childSub;
        if (query) {
            childSub = await SubChildCategorieModel.find({ sub_id: query }).sort({ _id: -1 })
        } else {
            childSub = await SubChildCategorieModel.find({}).sort({ _id: -1 }).populate(['development_id', 'categorie_id', 'sub_id', 'user'])
        }
        return res.status(201).json({ childSub })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* update one  */
const updateChilSubCategoties = async (req, res) => {
    const data = req.body;
    const { _id } = req.query;
    if (!_id) return res.status(400).json({ Message: 'Chil Sub ategoties Not select ' });
    const categoties = await SubChildCategorieModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
    return res.status(201).json({ categoties });
}


/* Delete  */
const deleteChildSubCategoties = async (req, res) => {
    try {
        const { _id } = req.query;
        const result = await SubChildCategorieModel.deleteMany({ _id: { $in: _id } });
        return res.status(201).json({ result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }

}




module.exports = {
    addChildSubCategoties, getChildSubCategoties, deleteChildSubCategoties, updateChilSubCategoties
}
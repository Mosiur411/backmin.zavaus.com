const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { UserModel } = require("../model/user.model");
const { getAuth } = require("firebase-admin/auth");
const { EmployeeModel } = require("../model/employee.model");
const admin = require('firebase-admin');
const { NotificationModel } = require("../model/notification");

const notificationToken = async () => {
    const allToken = await NotificationModel.find().select('token')
    const tokenArray = allToken.map(tokenDocument => tokenDocument.token);
    return tokenArray;
}



/* get data */
const getUserByEmail = async (email) => {
    try {
        const user = await EmployeeModel.findOne({ email })
        return user
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        throw new Error(errorMessage)
    }
}
/* user create */
const registerUser = async (req, res) => {
    try {
        const data = req.body;
        const firebaseUser = await getAuth().getUserByEmail(data?.email);
        if (!firebaseUser.uid) {
            return res.status(401).json({ error: 'Unauthorized User' })
        }
        data.uid = firebaseUser.uid
        const user = await UserModel(data)
        await user.save()
        return res.status(201).json({ user })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* user get  */
const getUser = async (req, res) => {
    try {
        const _id = req.user._id;
        const user = await UserModel.findById(_id)
        return res.status(201).json({ user })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* ============================= getUserInfo =============================*/
/* get */
const getUserInfo = async (req, res) => {
    try {
        const query_data = req?.query
        const user_result = await UserModel.find({ role: query_data?.role })
        return res.status(201).json({ user_result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* put */
const putUserInfo = async (req, res) => {
    try {
        const data = req?.body
        const _id = data?._id;
        const user = await UserModel.findById(_id)
        if (!user?.approved) {
            const UserRecord = await admin.auth().createUser({
                email: user.email,
                password: user.password,
            })
            if (UserRecord.uid) {
                const result = await UserModel.findOneAndUpdate({ _id }, { ...data, uid: UserRecord.uid }, { new: true })
                if (result) {
                    await getAuth().setCustomUserClaims(UserRecord.uid, { ...UserRecord.customClaims, role: user.role, _id: user._id, approved: true })
                    return res.status(200).json({ message: "Uses Successful Registration" })
                }
            }
        } else {
            const uid = user?.uid
            if (uid) {
                await admin.auth().deleteUser(uid);
                const result = await UserModel.findOneAndUpdate({ _id }, { approved: false, uid: '' }, { new: true })
                return res.status(200).json({ message: "Uses Successful Update" })
            }
        }


    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* delete */
const deleteUserInfo = async (req, res) => {
    try {
        const data = req?.body
        const _id = data?._id;
        const user = await UserModel.findById(_id)
        if (user?.uid) {
            await admin.auth().deleteUser(user?.uid);
            await UserModel.deleteOne({ _id: _id })
            return res.status(200).json({ message: "Uses Successful Delete" })

        } else {
            await UserModel.deleteOne({ _id: _id })
            return res.status(200).json({ message: "Uses Successful Delete" })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getSingleUserInfo = async (req, res) => {
    try {
        const { _id } = req?.query;
        if (!_id) return res.status(200).json({ message: "Data Not FountF" })
        const user = await UserModel.findById(_id)
        return res.status(200).json(user)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


/* user update  */
const updateUser = async (req, res) => {
    try {
        const { _id } = req.query;
        const data = req.body;
        const file = req.file;
        const img = file?.path;
        data.image = img;
        if (!_id) return res.status(401).json({ error: 'value not Update' })
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            return res.status(401).json({ error: 'value is Empty' })
        } else {
            const user = await UserModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
            return res.status(201).json({ user })
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const chnagesEmail = async (req, res) => {
    try {
        // NqL5qC8uE3O99NENFnWte2VUPpC2
        const newEmail = 'mosiurislam2003@gmail.com';
        const userUid = 'NqL5qC8uE3O99NENFnWte2VUPpC2';
        const result = await admin.auth().updateUser(userUid, { email: newEmail })
        return res.status(200).json(result)
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = {
    getUserByEmail,
    registerUser,
    getUser,
    updateUser,
    getUserInfo,
    putUserInfo,
    deleteUserInfo,
    getSingleUserInfo,
    notificationToken,
    chnagesEmail
}


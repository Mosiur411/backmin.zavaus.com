const { Router } = require('express')
const { getUser, updateUser, registerUser, getUserInfo, putUserInfo, deleteUserInfo, getSingleUserInfo } = require('../controller/user.controller')
const { Auth_Rqeuired } = require('../middleware/auth.middleware')
const { upload } = require('../middleware/files.middleware')
const userRoutes = Router()
userRoutes.post('/register', registerUser)
userRoutes.get('/user', Auth_Rqeuired, getUser)
userRoutes.put('/updateProfile', Auth_Rqeuired, upload.single('image'), updateUser)

/* admin user info  */
userRoutes.get('/userInfo', Auth_Rqeuired, getUserInfo)
userRoutes.put('/userInfo', putUserInfo)// Auth_Rqeuired,
userRoutes.delete('/userInfo', Auth_Rqeuired, deleteUserInfo)
userRoutes.get('/userInfo/single', Auth_Rqeuired, getSingleUserInfo)


module.exports = { userRoutes }
const { default: mongoose } = require("mongoose");
const { Router } = require('express')
const { getBlog, saveBlog, deleteBlog, updateBlog } = require('../controller/blog.controller');
const { Auth_Rqeuired } = require("../middleware/auth.middleware");
const blogRoutes = Router()
blogRoutes.get('/', getBlog)
blogRoutes.post('/', Auth_Rqeuired, saveBlog)
blogRoutes.put('/update/', Auth_Rqeuired, updateBlog)
blogRoutes.delete('/delete/', Auth_Rqeuired, deleteBlog)
module.exports = { blogRoutes }
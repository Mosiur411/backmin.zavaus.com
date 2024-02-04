const { Router } = require('express')
const { getBrand, saveBrand, updateBrand, deleteBrand, getAllBrand } = require('../controller/barnd.controller')
const brandRoutes = Router()
brandRoutes.get('/', getBrand)
brandRoutes.get('/all/', getAllBrand)
brandRoutes.post('/', saveBrand)
brandRoutes.put('/update/', updateBrand)
brandRoutes.delete('/delete', deleteBrand)
module.exports = { brandRoutes }
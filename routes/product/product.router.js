const { Router } = require('express')
const { addProduct, getProduct, updateProduct, deleteProduct, addBulkProduct, prodcutTypeHandle, popularProduct, topSellingProduct, trendingProduct, dealsofdayProduct, featuredProduct, topRatedProduct, dailybestsellsProduct } = require('../../controller/product/product.controller')
const productRoutes = Router()
productRoutes.post('/', addProduct)
productRoutes.post('/bulk', addBulkProduct)
productRoutes.get('/', getProduct)
productRoutes.put('/', updateProduct)
productRoutes.delete('/', deleteProduct)

/* ========================== porduct type handel  ========================== */
productRoutes.put('/type', prodcutTypeHandle)
productRoutes.get('/type/popular', popularProduct)
productRoutes.get('/type/topSelling', topSellingProduct)
productRoutes.get('/type/trending', trendingProduct)
productRoutes.get('/type/dealsofday', dealsofdayProduct)
productRoutes.get('/type/featured', featuredProduct)
productRoutes.get('/type/toprated', topRatedProduct)
productRoutes.get('/type/dailybestsells', dailybestsellsProduct)

/* ========================== porduct purchase  ========================== */


module.exports = {
    productRoutes
}
const { Router } = require('express')
const { singleSalesView, getSales } = require('../controller/sales.controller')
const SalesRoutes = Router()
SalesRoutes.get('/', getSales)
// SalesRoutes.put('/status', statusUpdateOnlineOrder)
// SalesRoutes.delete('/delete', deleteOnlineOder)
SalesRoutes.get('/single', singleSalesView)

module.exports = { SalesRoutes }
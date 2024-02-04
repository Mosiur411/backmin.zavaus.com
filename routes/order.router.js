const { Router } = require('express')
const { getOnlineOrder, statusUpdateOnlineOrder, deleteOnlineOder, singleOnlineOderView } = require('../controller/order.controller')
const OrderRoutes = Router()
OrderRoutes.get('/', getOnlineOrder)
OrderRoutes.put('/status', statusUpdateOnlineOrder)
OrderRoutes.delete('/delete', deleteOnlineOder)
OrderRoutes.get('/single', singleOnlineOderView)
module.exports = { OrderRoutes }
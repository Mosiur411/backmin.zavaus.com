const express = require('express')
const cors = require('cors')
const { connectDatabase } = require('./config/bd.config')
const { Auth_Rqeuired } = require('./middleware/auth.middleware')
const { initializeFirebase } = require('./config/firebase.config')
const { userRoutes } = require('./routes/user.routes')
const { developmentRoutes } = require('./routes/product/development.routes')
const { categoriesRoutes } = require('./routes/product/categories.routes')
const { subCategoriesRoutes } = require('./routes/product/subCategoties.router')
const { childsubRoutes } = require('./routes/product/childSubCategories.router')
const { productRoutes } = require('./routes/product/product.router')
const { dashboardRoutes } = require('./routes/dashboard.routes')
const { seoRoutes } = require('./routes/seo.router')
const { blogRoutes } = require('./routes/blog.router')
const { backupRoutes } = require('./routes/backup.router')
const { brandRoutes } = require('./routes/brand.router')
const { NotificationModel } = require('./model/notification')
const { OrderRoutes } = require('./routes/order.router')
const { SalesRoutes } = require('./routes/sales.router')
const { ProductModel } = require('./model/product/product.model')
require('dotenv').config()
const app = express()

/* server site port */
const port = process.env.PORT || 5001

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);





app.get('/', (req, res) => {
  res.send('Hello World!')
})
/* ============= dashboard =============*/
app.use('/dashboard', Auth_Rqeuired, dashboardRoutes)
/*product */
app.use('/', userRoutes)
app.use('/development', Auth_Rqeuired, developmentRoutes)
app.use('/categories', Auth_Rqeuired, categoriesRoutes)
app.use('/subCategories', Auth_Rqeuired, subCategoriesRoutes)
app.use('/childSubCategories', Auth_Rqeuired, childsubRoutes)
app.use('/product', Auth_Rqeuired, productRoutes)
/* website seo   */
app.use('/seo', Auth_Rqeuired, seoRoutes)
/*  brand  */
app.use('/brand', Auth_Rqeuired, brandRoutes)
/* blog */
app.use('/blog', Auth_Rqeuired, blogRoutes)
app.use('/backup', Auth_Rqeuired, backupRoutes)
/* oeder  */
app.use('/onlineOrder', Auth_Rqeuired, OrderRoutes)
app.use('/sales', Auth_Rqeuired, SalesRoutes)
/* remove all product  */
app.get('/remove/product/ditils', async (req, res) => {

  const filter = {};
  const update = {
    $set:
      { quantity: 0, totalItems: 0, stock: 0 }
  }
  // const result = await ProductModel.updateMany(filter, update);
  // return res.status(200).json({ message: result });


});




app.post('/storeToken', async (req, res) => {
  const { token } = req.body;
  if (!token) res.status(401).json({ message: 'Token Not stored' })
  const data = { token: token }
  const tokenSave = await NotificationModel(data)
  await tokenSave.save()
  res.status(200).json({ message: 'Token stored successfully' });
});

// database
const mongodb_uri = process.env.PROD_DB;
connectDatabase(mongodb_uri)
initializeFirebase()

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})
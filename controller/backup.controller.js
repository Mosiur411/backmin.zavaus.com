const { default: mongoose } = require("mongoose");
const { ProductModel } = require("../model/product/product.model");
const archiver = require("archiver");
const { UserModel } = require("../model/user.model");
const { BrandModel } = require("../model/brand");
const { SalesModel } = require("../model/sales.model");
const { EmployeeModel } = require("../model/employee.model");
const { SeoModel } = require("../model/seo.model");
const { BlogModel } = require("../model/blog.model");
const { PurchasesModel } = require("../model/purchase");
const { CategorieModel } = require("../model/product/categories.model");
const { SubCategorieModel } = require("../model/product/subcategories.model");
const { DevelopmentModel } = require("../model/product/development.model");
const { SubChildCategorieModel } = require("../model/product/childsub.model");
const { errorMessageFormatter } = require("../utils/helpers");
const OrderModel = require("../model/orderModel");

const getBackup = async (req, res) => {
    /* carts,coustomers, refunds,shrinkages  ai 4 ta akhono bad ace */
    try {
        const products = await ProductModel.find({}).lean();
        const developments = await DevelopmentModel.find({}).lean();
        const categories = await CategorieModel.find({}).lean();
        const subcategories = await SubCategorieModel.find({}).lean();
        const childsubcategories = await SubChildCategorieModel.find({}).lean();
        const blogs = await BlogModel.find({}).lean();
        const employees = await EmployeeModel.find({}).lean();
        const orders = await OrderModel.find({}).lean();
        const purchases = await PurchasesModel.find({}).lean();
        const sales = await SalesModel.find({}).lean();
        const seos = await SeoModel.find({}).lean();
        const users = await UserModel.find({}).lean();
        const brand = await BrandModel.find({}).lean();

        const archive = archiver("zip", { zlib: { level: 9 } });
        const currentDate = new Date().toISOString().slice(0, 10);
        res.attachment(`zava_${currentDate}.zip`);
        archive.pipe(res);
        archive.directory("zava", "zava");

        const productsJSON = JSON.stringify(products);
        const developmentsJSON = JSON.stringify(developments);
        const categoriesJSON = JSON.stringify(categories);
        const subcategoriesJSON = JSON.stringify(subcategories);
        const childsubcategoriesJSON = JSON.stringify(childsubcategories);
        const blogsJSON = JSON.stringify(blogs);
        const employeesJSON = JSON.stringify(employees);
        const ordersJSON = JSON.stringify(orders);
        const purchasesJSON = JSON.stringify(purchases);
        const salesJSON = JSON.stringify(sales);
        const seosJSON = JSON.stringify(seos);
        const usersJSON = JSON.stringify(users);
        const brandJSON = JSON.stringify(brand);

        archive.append(productsJSON, { name: `zava/products.json` });
        archive.append(developmentsJSON, { name: `zava/developments.json` });
        archive.append(categoriesJSON, { name: `zava/categories.json` });
        archive.append(subcategoriesJSON, { name: `zava/subcategories.json` });
        archive.append(childsubcategoriesJSON, { name: `zava/childsubcategories.json` });
        archive.append(blogsJSON, { name: `zava/blogs.json` });
        archive.append(employeesJSON, { name: `zava/employees.json` });
        archive.append(ordersJSON, { name: `zava/orders.json` });
        archive.append(purchasesJSON, { name: `zava/purchases.json` });
        archive.append(salesJSON, { name: `zava/sales.json` });
        archive.append(seosJSON, { name: `zava/seos.json` });
        archive.append(usersJSON, { name: `zava/users.json` });
        archive.append(brandJSON, { name: `zava/brand.json` });
        archive.finalize();
        res.attachment(`zava_${currentDate}.zip`);


        
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { getBackup }



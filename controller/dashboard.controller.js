const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const moment = require("moment/moment");
const { ProductModel } = require("../model/product/product.model");
const SalesModel = require("../model/sales.model");
const OrderModel = require("../model/orderModel");
const { RefundModel } = require("../model/refund.model");
const { ShrinkageModel } = require("../model/shrinkage.model");

const getRrecord = async (req, res) => {
    try {
        let pipeline = [];
        let invoicTotal = 0;
        let totalDue = 0;
        let { fromDate, toDate } = req.query;
        fromDate = fromDate == 'undefined' ? new Date() : fromDate;
        toDate = toDate == 'undefined' ? new Date() : toDate;
        var fromDateHandel = new Date(fromDate);
        var toDateHandel = new Date(toDate);
        fromDate = moment(fromDateHandel).startOf('day').toDate()
        toDate = moment(toDateHandel).endOf('day').toDate()
        let reportOptions = {
            filter: {
                createdAt: {
                    $gte: fromDate,
                    $lte: toDate
                },
                updatedAt: {
                    $gte: fromDate,
                    $lte: toDate
                }
            }
        }
        const { _id, role } = req.user
        const isAdmin = role == 'admin' ? true : false
        const order_count = await OrderModel.countDocuments();
        const product = await ProductModel.aggregate([
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: '$quantity'
                    },
                    totalPcs: {
                        $sum: '$totalItems'
                    },
                    cost: {
                        $sum: { $multiply: ["$quantity", "$cost"] }
                    },
                    totalCost: {
                        $sum: { $multiply: ["$stock", "$cost"] }
                    },
                }
            },
            {
                $project: {
                    cost: true,
                    quantity: true,
                    totalCost: true,
                    totalPcs: true,
                }
            }
        ])

        if (isAdmin) {
            pipeline = [];
        } else {
            pipeline = [
                {
                    $match: { user: _id }
                },
            ];
        }
        const onlineSale = await SalesModel.aggregate([
            { $match: reportOptions.filter },
            ...pipeline,
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: "$quantity"
                    },
                    onlineTotal: { $sum: "$prices" },
                }
            },
            {
                $project: {
                    quantity: true,
                    onlineTotal: true,
                }
            }
        ]);
        const oflineSales = await SalesModel.aggregate([
            { $match: reportOptions.filter },
            ...pipeline,
            {
                $unwind: "$item"
            },
            {
                $group: {
                    _id: 1,
                    offlineQuantity: {
                        $sum: "$item.quantity"
                    },
                    offlineTotal: { $sum: "$item.saleing_Price" },
                }
            },
            {
                $project: {
                    offlineQuantity: true,
                    offlineTotal: true,
                }
            }
        ]);
        const sale = [
            {
                total: onlineSale[0]?.onlineTotal + oflineSales[0]?.offlineTotal,
                quantity: onlineSale[0]?.quantity + oflineSales[0]?.offlineQuantity,
            }
        ]
        let payment = await SalesModel.aggregate([
            { $match: reportOptions?.filter },
            ...pipeline,
            {
                $group: {
                    _id: "$payment",
                    totalAmount: { $sum: "$totalPrice" }
                }
            }
        ],
        );
        for (const item of payment) {
            if (item._id !== 'due') {
                invoicTotal += item.totalAmount;
            } else {
                totalDue += item.totalAmount;
            }
        }
        payment = { totalInvoic: invoicTotal, totalDue: totalDue }


        const refund = await RefundModel.aggregate([
            { $match: reportOptions.filter },
            ...pipeline,
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: '$quantity'
                    },
                }
            },
            {
                $project: {
                    quantity: true,
                }
            }
        ]);
        const shrinkage = await ShrinkageModel.aggregate([
            { $match: reportOptions.filter },
            ...pipeline,
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: '$quantity'
                    },
                }
            },
            {
                $project: {
                    quantity: true,
                }
            }
        ]);















        const dashboard = {
            grossProfit: Number(product[0]?.cost) + Number(sale[0]?.total) - Number(product[0]?.totalCost),
            order_count: order_count,
            onlineSale: onlineSale,
            oflineSales: oflineSales,
        }

        return res.status(200).json({ products: product, sales: sale, payment: payment, dashboard: dashboard })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = { getRrecord }
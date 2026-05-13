const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// DASHBOARD STATS

exports.getDashboardStats =
  async (req, res) => {

    try {

      // TOTAL ORDERS

      const totalOrders =
        await Order.countDocuments();

      // TOTAL PRODUCTS

      const totalProducts =
        await Product.countDocuments();

      // DELIVERY AGENTS

      const deliveryAgents =
        await User.countDocuments({
          role: "delivery",
        });

      // TOTAL REVENUE

      const deliveredOrders =
        await Order.find({
          orderStatus:
            "DELIVERED",
        });

      const totalRevenue =
        deliveredOrders.reduce(
          (acc, item) =>
            acc + item.totalAmount,
          0
        );

      // ORDER STATUS COUNTS

      const delivered =
        await Order.countDocuments({
          orderStatus:
            "DELIVERED",
        });

      const placed =
        await Order.countDocuments({
          orderStatus:
            "PLACED",
        });

      const picking =
        await Order.countDocuments({
          orderStatus:
            "PICKING",
        });

      const ready =
        await Order.countDocuments({
          orderStatus:
            "READY",
        });

      const outForDelivery =
        await Order.countDocuments({
          orderStatus:
            "OUT_FOR_DELIVERY",
        });

      // RECENT ORDERS

      const recentOrders =
        await Order.find()
          .sort({
            createdAt: -1,
          })
          .limit(5);

      // TOP PRODUCTS

      const products =
        await Product.find()
          .sort({
            stock: 1,
          })
          .limit(5);

      res.json({

        totalOrders,

        totalProducts,

        deliveryAgents,

        totalRevenue,

        orderStatusData: {

          delivered,

          placed,

          picking,

          ready,

          outForDelivery,
        },

        recentOrders,

        topProducts: products,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };
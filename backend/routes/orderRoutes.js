const express = require("express");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  assignPicker,
  assignDelivery,
  cancelOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", createOrder);

router.get("/", getOrders);

router.get("/", getOrders);

router.put(
  "/status/:id",
  updateOrderStatus
);

// IMPORTANT
router.put(
  "/:id",
  updateOrderStatus
);

router.put(
  "/assign-picker/:id",
  assignPicker
);

router.put(
  "/assign-delivery/:id",
  assignDelivery
);

router.put(
  "/cancel/:id",
  cancelOrder
);


router.put(
  "/cash/:id",
  async (req, res) => {

    const Order =
      require("../models/Order");

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      order.cashReceived =
        req.body.cashReceived;

      order.cashCollectedAmount =
        req.body.cashCollectedAmount;

      await order.save();

      res.json(order);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);




router.put(
  "/admin-cash/:id",
  async (req, res) => {

    const Order =
      require("../models/Order");

    try {

      const order =
        await Order.findById(
          req.params.id
        );

      order.adminCashReceived =
        true;

      order.adminReceivedAt =
        new Date();

      await order.save();

      res.json(order);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;
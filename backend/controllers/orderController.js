const User = require("../models/User");

const Order = require("../models/Order");

const Product = require("../models/Product");

// CREATE ORDER

exports.createOrder = async (
  req,
  res
) => {

  try {

    const io =
      req.app.get("io");

    const {

      customerId,

      customerName,

      customerPhone,

      address,

      products,

      totalAmount,

      paymentMethod,

      gstAmount,

      deliveryCharge,

      platformFee,

    } = req.body;

    // CHECK STOCK

    for (const item of products) {

      const product =
        await Product.findOne({
          name: item.name,
        });

      if (!product) {

        return res.status(404).json({
          message:
            `${item.name} not found`,
        });
      }

      if (
        product.stock <
        item.quantity
      ) {

        return res.status(400).json({
          message:
            `${item.name} is out of stock`,
        });
      }
    }

    // REDUCE STOCK

    for (const item of products) {

      const product =
        await Product.findOne({
          name: item.name,
        });

      product.stock =
        product.stock -
        item.quantity;

      await product.save();
    }

    // CREATE ORDER

    const order =
      await Order.create({

        customerId,

        customerName,

        customerPhone,

        address,

        products,

        totalAmount,

        paymentMethod,

        gstAmount,

        deliveryCharge,

        platformFee,

        cashReceived:
          false,

        adminCashReceived:
          false,

        cashCollectedAmount:
          0,

        orderStatus:
          "PLACED",
      });

    // POPULATE

    const populatedOrder =
      await Order.findById(
        order._id
      )
        .populate("customerId")
        .populate("picker")
        .populate("deliveryAgent");

    io.emit(
      "NEW_ORDER",
      populatedOrder
    );

    res.status(201).json(
      populatedOrder
    );

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// GET ORDERS

exports.getOrders = async (
  req,
  res
) => {

  try {

    const orders =
      await Order.find()
        .populate("customerId")
        .populate("picker")
        .populate("deliveryAgent")
        .sort({
          createdAt: -1,
        });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// UPDATE STATUS

exports.updateOrderStatus =
  async (req, res) => {

    try {

      const io =
        req.app.get("io");

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404)
          .json({
            message:
              "Order not found",
          });
      }

      // BLOCK DELIVERED

      if (
        order.orderStatus ===
        "DELIVERED"
      ) {

        return res.status(400)
          .json({
            message:
              "Delivered order cannot be updated",
          });
      }

      // BLOCK CANCELLED

      if (
        order.orderStatus ===
        "CANCELLED"
      ) {

        return res.status(400)
          .json({
            message:
              "Cancelled order cannot be updated",
          });
      }

      // AUTO ASSIGN DELIVERY AGENT
      // WHEN DELIVERY BOY STARTS DELIVERY

      if (

        req.body.orderStatus ===
        "OUT_FOR_DELIVERY"

      ) {

        // ALREADY TAKEN

        if (
          order.deliveryAgent
        ) {

          return res.status(400)
            .json({
              message:
                "Order already taken by another delivery agent",
            });
        }

        // ASSIGN CURRENT DELIVERY AGENT

        order.deliveryAgent =
          req.body.deliveryId;
      }

      // UPDATE STATUS

      order.orderStatus =
        req.body.orderStatus;

      // SAVE PICKER

      if (
        req.body.pickerId
      ) {

        order.picker =
          req.body.pickerId;
      }

      await order.save();

      // POPULATE UPDATED ORDER

      const updatedOrder =
        await Order.findById(
          order._id
        )
          .populate("customerId")
          .populate("picker")
          .populate("deliveryAgent");

      // SOCKET EVENTS

      io.emit(
        "ORDER_UPDATED",
        updatedOrder
      );

      // READY EVENT

      if (
        updatedOrder.orderStatus ===
        "READY"
      ) {

        io.emit(
          "ORDER_READY",
          updatedOrder
        );
      }

      // DELIVERY EVENT

      if (
        updatedOrder.orderStatus ===
        "OUT_FOR_DELIVERY"
      ) {

        io.emit(
          "DELIVERY_STARTED",
          updatedOrder
        );
      }

      // DELIVERED EVENT

      if (
        updatedOrder.orderStatus ===
        "DELIVERED"
      ) {

        io.emit(
          "ORDER_DELIVERED",
          updatedOrder
        );
      }

      res.json(
        updatedOrder
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ASSIGN PICKER

exports.assignPicker =
  async (req, res) => {

    try {

      const io =
        req.app.get("io");

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404)
          .json({
            message:
              "Order not found",
          });
      }

      // BLOCK CANCELLED

      if (
        order.orderStatus ===
        "CANCELLED"
      ) {

        return res.status(400)
          .json({
            message:
              "Cancelled order",
          });
      }

      // BLOCK DELIVERED

      if (
        order.orderStatus ===
        "DELIVERED"
      ) {

        return res.status(400)
          .json({
            message:
              "Delivered order",
          });
      }

      // LOCK PICKER

      if (

        order.orderStatus ===
        "PICKING" ||

        order.orderStatus ===
        "READY" ||

        order.orderStatus ===
        "OUT_FOR_DELIVERY"

      ) {

        return res.status(400)
          .json({
            message:
              "Picker already locked",
          });
      }

      // SAVE PICKER

      order.picker =
        req.body.pickerId;

      // MOVE TO PICKING

      order.orderStatus =
        "PICKING";

      await order.save();

      const updatedOrder =
        await Order.findById(
          order._id
        )
          .populate("customerId")
          .populate("picker")
          .populate("deliveryAgent");

      io.emit(
        "ORDER_UPDATED",
        updatedOrder
      );

      res.json(
        updatedOrder
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

// ASSIGN DELIVERY
// NO MANUAL ASSIGN NOW

exports.assignDelivery =
  async (req, res) => {

    return res.json({
      message:
        "Manual delivery assignment disabled",
    });
  };

// CANCEL ORDER

exports.cancelOrder =
  async (req, res) => {

    try {

      const io =
        req.app.get("io");

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {

        return res.status(404)
          .json({
            message:
              "Order not found",
          });
      }

      // BLOCK AFTER DELIVERY STARTED

      if (

        order.orderStatus ===
        "OUT_FOR_DELIVERY" ||

        order.orderStatus ===
        "DELIVERED"

      ) {

        return res.status(400)
          .json({
            message:
              "Order cannot be cancelled",
          });
      }

      // RESTORE STOCK

      for (
        const item of
        order.products
      ) {

        const product =
          await Product.findOne({
            name:
              item.name,
          });

        if (product) {

          product.stock +=
            item.quantity;

          await product.save();
        }
      }

      // CANCEL ORDER

      order.orderStatus =
        "CANCELLED";

      order.cancelReason =
        req.body.reason;

      await order.save();

      const updatedOrder =
        await Order.findById(
          order._id
        )
          .populate("customerId")
          .populate("picker")
          .populate("deliveryAgent");

      io.emit(
        "ORDER_UPDATED",
        updatedOrder
      );

      res.json({

        message:
          "Order Cancelled",

        order:
          updatedOrder,
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };
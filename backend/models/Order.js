const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {


    customerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},



    customerName: {
      type: String,
      required: true,
    },

    customerPhone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    products: [
      {
        name: String,

        quantity: Number,

        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // PAYMENT

    paymentMethod: {
      type: String,

      enum: [
        "ONLINE",
        "COD",
      ],

      default: "ONLINE",
    },

    // EXTRA CHARGES

    gstAmount: {
      type: Number,
      default: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    // CASH COLLECTION

    cashReceived: {
      type: Boolean,
      default: false,
    },

    cashCollectedAmount: {
      type: Number,
      default: 0,
    },

    // ADMIN RECEIVED CASH

    adminCashReceived: {
      type: Boolean,
      default: false,
    },

    adminReceivedAt: {
      type: Date,
    },

    // ORDER STATUS

    orderStatus: {
      type: String,

      enum: [
        "PLACED",
        "PICKING",
        "READY",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
      ],

      default: "PLACED",
    },

    cancelReason: {
      type: String,
    },

    // PICKER

    picker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // DELIVERY AGENT

    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);
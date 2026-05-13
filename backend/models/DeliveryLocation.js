const mongoose =
  require("mongoose");

const deliveryLocationSchema =
  new mongoose.Schema({

    orderId: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Order",
    },

    latitude: Number,

    longitude: Number,

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports =
  mongoose.model(
    "DeliveryLocation",
    deliveryLocationSchema
  );
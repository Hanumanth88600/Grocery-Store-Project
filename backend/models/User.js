const mongoose =
  require("mongoose");

const userSchema =
  new mongoose.Schema(

    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,

        enum: [
          "admin",
          "customer",
          "picker",
          "delivery",
        ],

        default:
          "customer",
      },

      phone: {
        type: String,
      },

      avatar: {
  type: String,
},

savedCards: [

  {
    cardHolder: String,

    cardNumber: String,

    expiry: String,
  },
],

      addresses: [

        {
          fullAddress:
            String,

          city:
            String,

          pincode:
            String,
        },
      ],

      warehouse: {
        type: String,
      },
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );
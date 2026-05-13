const Razorpay =
  require("razorpay");

const crypto =
  require("crypto");

const razorpay =
  new Razorpay({

    key_id:
      process.env
        .RAZORPAY_KEY_ID,

    key_secret:
      process.env
        .RAZORPAY_KEY_SECRET,
  });


// CREATE ORDER

exports.createPaymentOrder =
  async (req, res) => {

    try {

      const options = {

        amount:
          req.body.amount * 100,

        currency: "INR",

        receipt:
          "receipt_order",
      };

      const order =
        await razorpay.orders.create(
          options
        );

      res.json(order);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };


// VERIFY PAYMENT

exports.verifyPayment =
  async (req, res) => {

    try {

      const {

        razorpay_order_id,

        razorpay_payment_id,

        razorpay_signature,

      } = req.body;

      const sign =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

      const expectedSign =
        crypto
          .createHmac(
            "sha256",
            process.env
              .RAZORPAY_KEY_SECRET
          )
          .update(sign.toString())
          .digest("hex");

      if (
        razorpay_signature ===
        expectedSign
      ) {

        return res.json({
          success: true,
          message:
            "Payment Verified",
        });
      }

      res.status(400).json({
        success: false,
        message:
          "Invalid Signature",
      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };
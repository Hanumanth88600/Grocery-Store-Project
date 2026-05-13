const express =
  require("express");

const router =
  express.Router();

const DeliveryLocation =
  require(
    "../models/DeliveryLocation"
  );

// UPDATE LOCATION

router.post(
  "/update",
  async (req, res) => {

    try {

      const io =
        req.app.get("io");

      const {
        orderId,
        latitude,
        longitude,
      } = req.body;

      let location =
        await DeliveryLocation.findOne({
          orderId,
        });

      // UPDATE EXISTING

      if (location) {

        location.latitude =
          latitude;

        location.longitude =
          longitude;

        location.updatedAt =
          new Date();

        await location.save();

      } else {

        // CREATE

        location =
          await DeliveryLocation.create({
            orderId,
            latitude,
            longitude,
          });
      }

      // SOCKET EVENT

      io.emit(
        "LOCATION_UPDATED",
        location
      );

      res.json(location);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// GET LOCATION

router.get(
  "/:orderId",
  async (req, res) => {

    try {

      const location =
        await DeliveryLocation.findOne({
          orderId:
            req.params.orderId,
        });

      res.json(location);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;
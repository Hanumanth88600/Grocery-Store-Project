const express =
require("express");

const {
  createStaff,
  getStaff,
  deleteStaff,
} = require(
  "../controllers/staffController"
);

const User =
require("../models/User");

const router =
express.Router();

//
// EXISTING ROUTES
//

// CREATE STAFF

router.post(
  "/",
  createStaff
);

// GET ALL STAFF

router.get(
  "/",
  getStaff
);

// DELETE STAFF

router.delete(
  "/:id",
  deleteStaff
);

//
// NEW ROUTES
//

// GET PICKERS

router.get(
  "/pickers",
  async (req, res) => {

    try {

      const pickers =
        await User.find({

          role:
            "picker",
        }).sort({
          createdAt: -1,
        });

      res.json(
        pickers
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
  }
);

// GET DELIVERY AGENTS

router.get(
  "/delivery",
  async (req, res) => {

    try {

      const deliveryAgents =
        await User.find({

          role:
            "delivery",
        }).sort({
          createdAt: -1,
        });

      res.json(
        deliveryAgents
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
  }
);

// GET CUSTOMERS

router.get(
  "/customers",
  async (req, res) => {

    try {

      const customers =
        await User.find({

          role:
            "customer",
        }).sort({
          createdAt: -1,
        });

      res.json(
        customers
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
  }
);

// GET ADMINS

router.get(
  "/admins",
  async (req, res) => {

    try {

      const admins =
        await User.find({

          role:
            "admin",
        }).sort({
          createdAt: -1,
        });

      res.json(
        admins
      );

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
  }
);

module.exports =
router;
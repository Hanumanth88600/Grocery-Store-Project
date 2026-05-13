const express =
require("express");

const {

  getProfile,

  updateProfile,

  changePassword,

  addCard,

} = require(
  "../controllers/profileController"
);

const router =
express.Router();

router.get(
  "/:id",
  getProfile
);

router.put(
  "/update/:id",
  updateProfile
);

router.put(
  "/password/:id",
  changePassword
);

router.post(
  "/card/:id",
  addCard
);

module.exports =
router;
const User =
require("../models/User");

const bcrypt =
require("bcryptjs");


// GET PROFILE

exports.getProfile =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// UPDATE PROFILE

exports.updateProfile =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404)
      .json({
        message:
          "User not found",
      });
    }

    user.name =
      req.body.name ||
      user.name;

    user.phone =
      req.body.phone ||
      user.phone;

    user.avatar =
      req.body.avatar ||
      user.avatar;

    await user.save();

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// CHANGE PASSWORD

exports.changePassword =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    const {
      oldPassword,
      newPassword,
    } = req.body;

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400)
      .json({
        message:
          "Old password incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.json({
      message:
        "Password Updated",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};


// ADD CARD

exports.addCard =
async (req, res) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    user.savedCards.push(
      req.body
    );

    await user.save();

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};  
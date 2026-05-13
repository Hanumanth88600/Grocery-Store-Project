const User = require("../models/User");

const bcrypt = require("bcryptjs");


// CREATE STAFF

exports.createStaff = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
      role,
      phone,
      warehouse,
    } = req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        warehouse,
      });

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// GET STAFF

exports.getStaff = async (
  req,
  res
) => {

  try {

    const users =
      await User.find({
        role: {
          $in: [
            "picker",
            "delivery",
          ],
        },
      }).select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// DELETE STAFF

exports.deleteStaff = async (
  req,
  res
) => {

  try {

    await User.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Staff Deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};
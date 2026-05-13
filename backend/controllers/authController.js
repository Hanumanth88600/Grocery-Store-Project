const User =
  require("../models/User");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

// GENERATE TOKEN

const generateToken =
  (id, role) => {

    return jwt.sign(
      {
        id,
        role,
      },
      process.env.JWT_SECRET,

      {
        expiresIn:
          "7d",
      }
    );
  };

// REGISTER

exports.register =
  async (req, res) => {

    try {

      const {
        name,
        email,
        password,
        phone,
        role,
        warehouse,
      } = req.body;

      // CHECK USER

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400)
          .json({

            message:
              "User already exists",
          });
      }

      // HASH PASSWORD

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // ALLOWED ROLES

      const allowedRoles = [

        "customer",

        "picker",

        "delivery",

        "admin",
      ];

      const finalRole =
        allowedRoles.includes(role)
          ? role
          : "customer";

      // CREATE USER

      const user =
        await User.create({

          name,

          email,

          phone,

          warehouse,

          role:
            finalRole,

          password:
            hashedPassword,
        });

      // TOKEN

      const token =
        generateToken(
          user._id,
          user.role
        );

      res.status(201).json({

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          phone:
            user.phone,

          warehouse:
            user.warehouse,

          createdAt:
            user.createdAt,
        },
      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message,
      });
    }
  };

// LOGIN

exports.login =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      console.log("EMAIL:", email);
      console.log("PASSWORD:", password);

      // FIND USER

      const user =
        await User.findOne({
          email,
        });

      console.log("USER:", user);

      if (!user) {

        return res.status(400)
          .json({

            message:
              "Invalid Email",
          });
      }

      // CHECK PASSWORD

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      console.log(
        "PASSWORD MATCH:",
        isMatch
      );

      if (!isMatch) {

        return res.status(400)
          .json({

            message:
              "Invalid Password",
          });
      }

      // TOKEN

      const token =
        generateToken(
          user._id,
          user.role
        );

      res.json({

        token,

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          phone:
            user.phone,

          warehouse:
            user.warehouse,
        },
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,
      });
    }
  };
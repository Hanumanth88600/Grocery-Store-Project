const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

// LOAD ENV FIRST

dotenv.config();

const cors = require("cors");

const http = require("http");

const { Server } = require("socket.io");

// ROUTES

const authRoutes =
  require("./routes/authRoutes");

const productRoutes =
  require("./routes/productRoutes");

const staffRoutes =
  require("./routes/staffRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

const locationRoutes =
  require("./routes/locationRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

const profileRoutes =
  require("./routes/profileRoutes");

const app = express();

const server =
  http.createServer(app);

// SOCKET.IO

const io = new Server(server, {

  cors: {

    origin: "*",

    methods: [
      "GET",
      "POST",
      "PUT",
    ],
  },
});

// STORE IO

app.set("io", io);

// MIDDLEWARE

app.use(cors());

app.use(express.json());

// ROUTES

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/staff",
  staffRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/location",
  locationRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

// SOCKET CONNECTION

io.on(
  "connection",
  (socket) => {

    console.log(
      "User Connected:",
      socket.id
    );

    socket.on(
      "disconnect",
      () => {

        console.log(
          "User Disconnected"
        );
      }
    );
  }
);

// DATABASE CONNECTION

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {

    console.log(
      "MongoDB Connected"
    );
  })
  .catch((err) => {

    console.log(err);
  });

// TEST ROUTE

app.get("/", (req, res) => {

  res.send(
    "Blinkit Backend Running..."
  );
});

// SERVER

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});
import {
  FaUserCircle,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import React,
{
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

import {
  motion,
} from "framer-motion";

import { io }
from "socket.io-client";

// SOCKET CONNECTION

const socket =
  io("https://grocery-store-project-l9y7.onrender.com");

const PickerDashboard = () => {

  const [orders,
    setOrders] =
    useState([]);

  // FETCH ORDERS

  const fetchOrders =
    async () => {

      try {

        const { data } =
          await axios.get(
            "https://grocery-store-project-l9y7.onrender.com/api/orders"
          );

        // ONLY PLACED + PICKING

        const filtered =
          data.filter(
            (order) =>
              order.orderStatus ===
                "PLACED" ||
              order.orderStatus ===
                "PICKING"
          );

        setOrders(filtered);

      } catch (error) {

        console.log(error);
      }
    };

    const navigate =
  useNavigate();

const [
  showMenu,
  setShowMenu,
] = useState(false);

const user =
  JSON.parse(
    localStorage.getItem(
      "user"
    )
  );

  // INITIAL FETCH

  useEffect(() => {

    fetchOrders();

  }, []);

  // SOCKET LISTENERS

  useEffect(() => {

    // NEW ORDER

    socket.on(
      "NEW_ORDER",
      (newOrder) => {

        setOrders((prev) => [

          ...prev,
          newOrder,
        ]);
      }
    );

    // ORDER UPDATED

    socket.on(
      "ORDER_UPDATED",
      () => {

        fetchOrders();
      }
    );

    return () => {

      socket.off(
        "NEW_ORDER"
      );

      socket.off(
        "ORDER_UPDATED"
      );
    };

  }, []);

  // START PICKING

  const startPicking =
  async (id) => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      await axios.put(
        `https://grocery-store-project-l9y7.onrender.com/api/orders/${id}`,
        {
          orderStatus:
            "PICKING",

          pickerId:
            user._id,
        }
      );

    } catch (error) {

      console.log(error);
    }
  };

  // MARK READY

  const markReady =
    async (id) => {

      try {

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/orders/${id}`,
          {
            orderStatus:
              "READY",
          }
        );

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

  <div>

    <h1 className="text-5xl font-bold">

      Picker Dashboard

    </h1>

    <p className="text-gray-500 mt-2">

      Real-time warehouse management

    </p>

  </div>

  <div className="flex items-center gap-5">

    <div className="bg-green-600 text-white px-6 py-3 rounded-2xl text-xl font-bold shadow-lg">

      Total Orders:
      {" "}
      {orders.length}

    </div>

    {/* PROFILE */}

    <div className="relative">

      <button
        onClick={() =>
          setShowMenu(
            !showMenu
          )
        }
      >

        {
          user?.avatar ? (

            <img
              src={user.avatar}
              alt=""
              className="w-14 h-14 rounded-full object-cover border-2 border-green-600"
            />

          ) : (

            <FaUserCircle
              className="text-5xl text-green-600"
            />
          )
        }

      </button>

      {
        showMenu && (

          <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden z-50">

            <button
              onClick={() =>
                navigate(
                  "/picker-profile"
                )
              }
              className="w-full text-left px-5 py-4 hover:bg-gray-100 font-semibold"
            >

              My Profile

            </button>

            <button
              onClick={() => {

                localStorage.clear();

                navigate("/");
              }}
              className="w-full text-left px-5 py-4 hover:bg-red-100 text-red-600 font-semibold"
            >

              Logout

            </button>

          </div>
        )
      }

    </div>

  </div>

</div>

      {/* ORDERS */}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {
          orders.map((order) => (

            <motion.div
              whileHover={{
                y: -5,
              }}
              key={order._id}
              className="bg-white rounded-3xl p-6 shadow-xl"
            >

              {/* TOP */}

              <div className="flex justify-between items-center">

                <h2 className="text-2xl font-bold">

                  #{order._id.slice(-6)}

                </h2>

                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  order.orderStatus ===
                  "PLACED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}>

                  {order.orderStatus}

                </span>

              </div>

              {/* CUSTOMER */}

              <div className="mt-5">

                <h3 className="text-xl font-bold">

                  {order.customerName}

                </h3>

                <p className="text-gray-500 mt-1">

                  {order.customerPhone}

                </p>

                <p className="text-gray-500 mt-1">

                  {order.address}

                </p>

              </div>

              {/* PRODUCTS */}

              <div className="mt-6">

                <h3 className="font-bold text-lg mb-3">

                  Products

                </h3>

                <div className="space-y-3">

                  {
                    order.products.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="flex justify-between bg-gray-100 p-3 rounded-xl"
                        >

                          <span>

                            {item.name}

                          </span>

                          <span className="font-bold">

                            x{item.quantity}

                          </span>

                        </div>
                      )
                    )
                  }

                </div>

              </div>

              {/* TOTAL */}

              <div className="mt-6">

                <h3 className="text-2xl font-bold text-green-600">

                  ₹{order.totalAmount}

                </h3>

              </div>

              {/* BUTTONS */}

              <div className="mt-8">

                {
                  order.orderStatus ===
                  "PLACED" ? (

                    <button
                      onClick={() =>
                        startPicking(
                          order._id
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
                    >

                      <FaBoxOpen />

                      Start Picking

                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        markReady(
                          order._id
                        )
                      }
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
                    >

                      <FaCheckCircle />

                      Mark Ready

                    </button>
                  )
                }

              </div>

            </motion.div>
          ))
        }

      </div>

    </div>
  );
};

export default PickerDashboard;
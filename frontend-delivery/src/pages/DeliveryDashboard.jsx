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
  useRef,
} from "react";

import axios from "axios";

import {
  FaMotorcycle,
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  motion,
} from "framer-motion";

import { io }
from "socket.io-client";

// SOCKET

const socket =
  io("https://grocery-store-project-l9y7.onrender.com");

const DeliveryDashboard = () => {

  const [orders,
    setOrders] =
    useState([]);

  // GPS INTERVAL

  const intervalRef =
    useRef(null);

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

  // FETCH ORDERS

const fetchOrders =
  async () => {

    try {

      const { data } =
        await axios.get(
          "https://grocery-store-project-l9y7.onrender.com/api/orders"
        );

      const filtered =
        data.filter(
          (order) =>

            // SHOW READY ORDERS TO ALL AGENTS

            (
              order.orderStatus ===
              "READY"
            )

            ||

            // SHOW ONLY MY ACTIVE DELIVERY

            (
              order.deliveryAgent &&

              order.deliveryAgent._id ===
                user._id &&

              order.orderStatus ===
                "OUT_FOR_DELIVERY"
            )
        );

      setOrders(filtered);

    } catch (error) {

      console.log(error);
    }
  };

  // INITIAL FETCH

  useEffect(() => {

    fetchOrders();

  }, []);

  // SOCKET EVENTS

  useEffect(() => {

    socket.on(
      "ORDER_READY",
      () => {

        fetchOrders();
      }
    );

    socket.on(
      "DELIVERY_STARTED",
      () => {

        fetchOrders();
      }
    );

    socket.on(
      "ORDER_DELIVERED",
      () => {

        fetchOrders();
      }
    );

    socket.on(
      "ORDER_UPDATED",
      () => {

        fetchOrders();
      }
    );

    return () => {

      socket.off(
        "ORDER_READY"
      );

      socket.off(
        "DELIVERY_STARTED"
      );

      socket.off(
        "ORDER_DELIVERED"
      );

      socket.off(
        "ORDER_UPDATED"
      );

      if (
        intervalRef.current
      ) {

        clearInterval(
          intervalRef.current
        );
      }
    };

  }, []);

  // START LIVE LOCATION

  const startLiveLocation =
    (orderId) => {

      if (
        intervalRef.current
      ) {

        clearInterval(
          intervalRef.current
        );
      }

      intervalRef.current =
        setInterval(() => {

          navigator.geolocation.getCurrentPosition(

            async (position) => {

              const latitude =
                position.coords.latitude;

              const longitude =
                position.coords.longitude;

              try {

                await axios.post(
                  "https://grocery-store-project-l9y7.onrender.com/api/location/update",
                  {
                    orderId,
                    latitude,
                    longitude,
                  }
                );

              } catch (error) {

                console.log(error);
              }
            },

            (error) => {

              console.log(error);
            }
          );

        }, 5000);
    };

  // START DELIVERY

  const startDelivery =
  async (id) => {

    try {

      const existingOrder =
        orders.find(
          (o) => o._id === id
        );

      // SOMEONE ALREADY TOOK ORDER

      if (
        existingOrder.deliveryAgent
      ) {

        alert(
          "Order already taken by another delivery agent"
        );

        return;
      }

      await axios.put(
        `https://grocery-store-project-l9y7.onrender.com/api/orders/status/${id}`,
        {

          orderStatus:
            "OUT_FOR_DELIVERY",

          deliveryId:
            user._id,
        }
      );

      startLiveLocation(id);

      fetchOrders();

    } catch (error) {

      console.log(error);
    }
  };

  // CASH RECEIVED

  const markCashReceived =
    async (id, amount) => {

      try {

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/orders/cash/${id}`,
          {
            cashReceived:
              true,

            cashCollectedAmount:
              amount,
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  // MARK DELIVERED

  const markDelivered =
    async (id, order) => {

      try {

        // COD VALIDATION

        if (
          order.paymentMethod ===
            "COD" &&

          !order.cashReceived
        ) {

          alert(
            "Please collect cash first"
          );

          return;
        }

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/orders/${id}`,
          {
            orderStatus:
              "DELIVERED",

            deliveryId:
              user._id,
          }
        );

        // STOP GPS

        if (
          intervalRef.current
        ) {

          clearInterval(
            intervalRef.current
          );
        }

        fetchOrders();

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

            Delivery Dashboard

          </h1>

          <p className="text-gray-500 mt-2">

            Real-time delivery management

          </p>

        </div>

        <div className="flex items-center gap-5">

          <div className="bg-green-600 text-white px-6 py-3 rounded-2xl text-xl font-bold shadow-lg">

            Active Deliveries:
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
                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-600"
                  />

                ) : (

                  <FaUserCircle
                    className="text-5xl text-orange-600"
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
                        "/delivery-profile"
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
                  "READY"
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

                <div className="flex items-start gap-2 mt-3">

                  <FaMapMarkerAlt className="text-red-500 mt-1" />

                  <p className="text-gray-600">

                    {order.address}

                  </p>

                </div>

              </div>

              {/* PRODUCTS */}

              <div className="mt-6">

                <h3 className="font-bold text-lg mb-3">

                  Order Items

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

              {/* PAYMENT METHOD */}

              <div className="mt-5">

                <span className={`px-4 py-2 rounded-xl font-bold ${
                  order.paymentMethod ===
                  "COD"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>

                  {order.paymentMethod}

                </span>

              </div>

              {/* COD BLOCK */}

             {
  order.paymentMethod ===
    "COD" &&

  order.orderStatus ===
    "OUT_FOR_DELIVERY" &&

  !order.cashReceived && (

                  <div className="bg-yellow-50 border border-yellow-300 rounded-3xl p-5 mt-6">

                    <h2 className="text-xl font-bold mb-5">

                      Cash Collection

                    </h2>

                    {/* QR */}

                    <div className="bg-white rounded-3xl p-4 flex justify-center mb-5">

                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PAY-${order._id}`}
                        alt=""
                        className="rounded-2xl"
                      />

                    </div>

                    {/* CHECKBOX */}

                    <div className="flex items-center gap-4">

                      <input
                        type="checkbox"
                        checked={
                          order.cashReceived
                        }
                        onChange={() =>
                          markCashReceived(
                            order._id,
                            order.totalAmount
                          )
                        }
                        className="w-6 h-6"
                      />

                      <p className="font-bold">

                        Cash Received

                      </p>

                    </div>

                  </div>
                )
              }

              {/* CASH SUCCESS */}

              {
                order.cashReceived && (

                  <div className="bg-green-100 text-green-700 p-4 rounded-2xl mt-5">

                    <h2 className="font-bold text-lg">

                      Cash Collected Successfully

                    </h2>

                    <p className="mt-1">

                      Amount:
                      {" "}
                      ₹
                      {
                        order.cashCollectedAmount
                      }

                    </p>

                  </div>
                )
              }

              {/* BUTTON */}

              <div className="mt-8">

  {
    order.orderStatus ===
    "READY" ? (

      <button
        onClick={() =>
          startDelivery(
            order._id
          )
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
      >

        <FaMotorcycle />

        Start Delivery

      </button>

    ) : (

      <button
        disabled={
          order.paymentMethod ===
            "COD" &&

          !order.cashReceived
        }
        onClick={() =>
          markDelivered(
            order._id,
            order
          )
        }
        className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 ${
          order.paymentMethod ===
            "COD" &&

          !order.cashReceived
            ? "bg-gray-400 cursor-not-allowed text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >

        <FaCheckCircle />

        {
          order.paymentMethod ===
            "COD" &&

          !order.cashReceived
            ? "Collect Cash First"
            : "Mark Delivered"
        }

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

export default DeliveryDashboard;
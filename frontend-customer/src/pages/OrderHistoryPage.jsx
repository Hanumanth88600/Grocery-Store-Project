import React,
{
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaTruck,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import { motion }
from "framer-motion";

const OrderHistoryPage = () => {

  const navigate =
    useNavigate();

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

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

      console.log(
        "ALL ORDERS:",
        data
      );

      console.log(
        "CURRENT USER:",
        user
      );

      // ONLY CURRENT USER ORDERS

      const filtered =
        data.filter(
          (order) => {

            // IGNORE OLD ORDERS
            // WITHOUT customerId

            if (
              !order.customerId
            ) {

              return false;
            }

            // POPULATED OBJECT

            if (
              typeof order.customerId ===
              "object"
            ) {

              return (
                order.customerId._id ===
                user?._id
              );
            }

            // STRING ID

            return (
              order.customerId ===
              user?._id
            );
          }
        );

      // SORT LATEST FIRST

      const sorted =
        filtered.sort(
          (a, b) =>

            new Date(
              b.createdAt
            ) -

            new Date(
              a.createdAt
            )
        );

      console.log(
        "FILTERED:",
        sorted
      );

      setOrders(sorted);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchOrders();

  }, []);

  // TRACK ORDER

  const trackOrder =
    (orderId) => {

      localStorage.setItem(
        "currentOrderId",
        orderId
      );

      navigate("/tracking");
    };

  // REORDER

  const reorder =
    () => {

      alert(
        "Reorder feature coming next 🚀"
      );
    };

  // CANCEL ORDER

  const cancelOrder =
    async (id) => {

      const reason =
        prompt(
          "Enter cancellation reason"
        );

      if (!reason) {

        return;
      }

      try {

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/orders/cancel/${id}`,
          {
            reason,
          }
        );

        alert(
          "Order Cancelled Successfully"
        );

        fetchOrders();

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||

          "Cancellation Failed"
        );
      }
    };

  // STATUS COLORS

  const getStatusColor =
    (status) => {

      switch (status) {

        case "PLACED":
          return "bg-yellow-100 text-yellow-700";

        case "PICKING":
          return "bg-blue-100 text-blue-700";

        case "READY":
          return "bg-purple-100 text-purple-700";

        case "OUT_FOR_DELIVERY":
          return "bg-orange-100 text-orange-700";

        case "DELIVERED":
          return "bg-green-100 text-green-700";

        case "CANCELLED":
          return "bg-red-100 text-red-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">

        <div>

          <h1 className="text-5xl font-bold">

            My Orders

          </h1>

          <p className="text-gray-500 mt-2">

            Track all your previous orders

          </p>

        </div>

        <button
          onClick={() =>
            navigate("/")
          }
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
        >

          Back To Shop

        </button>

      </div>

      {/* LOADING */}

      {
        loading ? (

          <div className="text-center text-3xl font-bold mt-20">

            Loading Orders...

          </div>

        ) : orders.length === 0 ? (

          <div className="text-center text-3xl font-bold mt-20">

            No Orders Found

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

            {
              orders.map((order) => (

                <motion.div
                  key={order._id}
                  whileHover={{
                    y: -5,
                  }}
                  className="bg-white rounded-3xl shadow-xl p-6"
                >

                  {/* TOP */}

                  <div className="flex justify-between items-center">

                    <div>

                      <h2 className="text-2xl font-bold">

                        #{order._id.slice(-6)}

                      </h2>

                      <p className="text-gray-500 mt-1">

                        {
                          new Date(
                            order.createdAt
                          ).toLocaleString()
                        }

                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-xl font-bold text-sm ${
                        getStatusColor(
                          order.orderStatus
                        )
                      }`}
                    >

                      {order.orderStatus}

                    </span>

                  </div>

                  {/* CANCELLED */}

                  {
                    order.orderStatus ===
                    "CANCELLED" && (

                      <div className="bg-red-50 border border-red-200 p-4 rounded-2xl mt-5">

                        <p className="text-red-600 font-bold flex items-center gap-2">

                          <FaTimesCircle />

                          Cancelled Order

                        </p>

                        <p className="text-gray-600 mt-2">

                          Reason:
                          {" "}
                          {
                            order.cancelReason
                          }

                        </p>

                      </div>
                    )
                  }

                  {/* CUSTOMER */}

                  <div className="mt-5">

                    <h3 className="text-xl font-bold">

                      {order.customerName}

                    </h3>

                    <p className="text-gray-500">

                      {order.customerPhone}

                    </p>

                    <p className="text-gray-500 mt-1">

                      {order.address}

                    </p>

                  </div>

                  {/* PRODUCTS */}

                  <div className="mt-6">

                    <h3 className="font-bold text-lg mb-3">

                      Ordered Items

                    </h3>

                    <div className="space-y-3">

                      {
                        order.products.map(
                          (
                            item,
                            index
                          ) => (

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

                    <h2 className="text-3xl font-bold text-green-600">

                      ₹{order.totalAmount}

                    </h2>

                  </div>

                  {/* BUTTONS */}

                  <div className="grid grid-cols-3 gap-3 mt-8">

                    {/* TRACK */}

                    <button
                      onClick={() =>
                        trackOrder(
                          order._id
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >

                      <FaTruck />

                      Track

                    </button>

                    {/* REORDER */}

                    <button
                      onClick={() =>
                        reorder(order)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                    >

                      <FaRedo />

                      Reorder

                    </button>

                    {/* CANCEL */}

                    {
                      order.orderStatus !==
                        "OUT_FOR_DELIVERY" &&

                      order.orderStatus !==
                        "DELIVERED" &&

                      order.orderStatus !==
                        "CANCELLED" && (

                        <button
                          onClick={() =>
                            cancelOrder(
                              order._id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold"
                        >

                          Cancel

                        </button>
                      )
                    }

                  </div>

                </motion.div>
              ))
            }

          </div>
        )
      }

    </div>
  );
};

export default OrderHistoryPage;
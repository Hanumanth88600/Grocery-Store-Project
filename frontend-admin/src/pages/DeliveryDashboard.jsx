import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaCheckCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";

const DeliveryDashboard = () => {

  const [orders,
    setOrders] =
    useState([]);

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
            "http://localhost:5000/api/orders"
          );

        const filtered =
          data.filter(
            (order) =>

              order.deliveryAgent &&

              order.deliveryAgent._id ===
                user._id &&

              (
                order.orderStatus ===
                  "READY" ||

                order.orderStatus ===
                  "OUT_FOR_DELIVERY"
              )
          );

        setOrders(filtered);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchOrders();

  }, []);

  // START DELIVERY

  const acceptDelivery =
    async (id) => {

      try {

        await axios.put(
          `http://localhost:5000/api/orders/status/${id}`,
          {

            orderStatus:
              "OUT_FOR_DELIVERY",

            deliveryId:
              user._id,
          }
        );

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
          `http://localhost:5000/api/orders/cash/${id}`,
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

  // DELIVER ORDER

  const deliverOrder =
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
          `http://localhost:5000/api/orders/${id}`,
          {

            orderStatus:
              "DELIVERED",

            deliveryId:
              user._id,
          }
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  // STATUS STYLE

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "READY":
          return "bg-purple-100 text-purple-700";

        case "OUT_FOR_DELIVERY":
          return "bg-orange-100 text-orange-700";

        default:
          return "bg-gray-100 text-gray-700";
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-12">

        <div>

          <h1 className="text-6xl font-bold">

            Delivery Dashboard

          </h1>

          <p className="text-gray-500 text-2xl mt-3">

            Real-time delivery management

          </p>

        </div>

        <div className="flex items-center gap-6">

          <div className="bg-green-600 text-white px-8 py-5 rounded-3xl shadow-xl text-3xl font-bold">

            Active Deliveries:
            {" "}
            {orders.length}

          </div>

          <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold">

            {
              user?.name?.charAt(0)
            }

          </div>

        </div>

      </div>

      {/* ORDERS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {
          orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-[35px] shadow-2xl p-8"
            >

              {/* TOP */}

              <div className="flex justify-between mb-8">

                <h2 className="text-4xl font-bold">

                  #
                  {order._id}

                </h2>

                <span
                  className={`${getStatusStyle(
                    order.orderStatus
                  )} px-6 py-3 rounded-2xl font-bold text-2xl`}
                >

                  {
                    order.orderStatus
                  }

                </span>

              </div>

              {/* CUSTOMER */}

              <div className="mb-8">

                <h3 className="text-4xl font-bold mb-4">

                  {
                    order.customerName
                  }

                </h3>

                <p className="text-gray-500 text-2xl">

                  {
                    order.customerPhone
                  }

                </p>

                <div className="flex items-center gap-3 mt-5 text-gray-600 text-2xl">

                  <FaMapMarkerAlt
                    className="text-red-500"
                  />

                  {
                    order.address
                  }

                </div>

              </div>

              {/* PRODUCTS */}

              <div className="mb-8">

                <h3 className="text-3xl font-bold mb-6">

                  Order Items

                </h3>

                <div className="space-y-4">

                  {
                    order.products.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="bg-gray-100 rounded-2xl px-5 py-5 flex justify-between"
                        >

                          <span className="text-2xl">

                            {
                              item.name
                            }

                          </span>

                          <span className="text-2xl font-bold">

                            x
                            {
                              item.quantity
                            }

                          </span>

                        </div>
                      )
                    )
                  }

                </div>

              </div>

              {/* PRICE */}

              <h2 className="text-5xl font-bold text-green-600 mb-6">

                ₹
                {
                  order.totalAmount
                }

              </h2>

              {/* PAYMENT */}

              <div className="mb-8">

                <span className={`px-5 py-3 rounded-2xl font-bold text-2xl ${
                  order.paymentMethod ===
                  "COD"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}>

                  {
                    order.paymentMethod
                  }

                </span>

              </div>

              {/* COD BLOCK */}

              {
                order.paymentMethod ===
                  "COD" &&

                !order.cashReceived && (

                  <div className="bg-yellow-50 border border-yellow-300 rounded-3xl p-6 mb-8">

                    <h2 className="text-3xl font-bold mb-6">

                      Cash Collection

                    </h2>

                    {/* QR */}

                    <div className="bg-white rounded-3xl p-4 flex justify-center mb-6">

                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PAY-${order._id}`}
                        alt=""
                        className="rounded-2xl"
                      />

                    </div>

                    {/* CHECKBOX */}

                    <div className="flex items-center gap-5">

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
                        className="w-8 h-8"
                      />

                      <p className="text-2xl font-bold">

                        Cash Received

                      </p>

                    </div>

                  </div>
                )
              }

              {/* CASH RECEIVED SUCCESS */}

              {
                order.cashReceived && (

                  <div className="bg-green-100 text-green-700 p-5 rounded-3xl mb-8">

                    <h2 className="text-2xl font-bold">

                      Cash Collected Successfully

                    </h2>

                    <p className="text-xl mt-2">

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

              {
                order.orderStatus ===
                  "READY" ? (

                  <button
                    onClick={() =>
                      acceptDelivery(
                        order._id
                      )
                    }
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full py-6 rounded-3xl font-bold text-3xl"
                  >

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
                      deliverOrder(
                        order._id,
                        order
                      )
                    }
                    className={`w-full py-6 rounded-3xl font-bold text-3xl flex justify-center items-center gap-4 ${
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
          ))
        }

      </div>

    </div>
  );
};

export default DeliveryDashboard;
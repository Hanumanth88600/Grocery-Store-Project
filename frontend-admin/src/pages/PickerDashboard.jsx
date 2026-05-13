import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

const PickerDashboard = () => {

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

        // SHOW ONLY ASSIGNED PICKER ORDERS

        const filtered =
          data.filter(
            (order) =>

              order.picker &&

              order.picker._id ===
                user._id &&

              (
                order.orderStatus ===
                  "PLACED" ||

                order.orderStatus ===
                  "PICKING"
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

  // START PICKING

  const acceptOrder =
    async (id) => {

      try {

        await axios.put(
  `http://localhost:5000/api/orders/status/${id}`,
  {

    orderStatus:
      "PICKING",

    pickerId:
      user._id,
  }
);

        fetchOrders();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message
        );
      }
    };

  // MARK READY

  const readyOrder =
    async (id) => {

      try {

        await axios.put(
  `http://localhost:5000/api/orders/status/${id}`,
  {

    orderStatus:
      "READY",

    pickerId:
      user._id,
  }
);

        fetchOrders();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message
        );
      }
    };

  // STATUS COLORS

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "PLACED":
          return "bg-yellow-100 text-yellow-700";

        case "PICKING":
          return "bg-blue-100 text-blue-700";

        case "READY":
          return "bg-green-100 text-green-700";

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

            Picker Dashboard

          </h1>

          <p className="text-gray-500 mt-2">

            Real-time warehouse management

          </p>

        </div>

        <div className="flex items-center gap-6">

          <div className="bg-green-600 text-white px-8 py-4 rounded-3xl shadow-xl font-bold text-2xl">

            Total Orders:
            {" "}
            {orders.length}

          </div>

          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">

            {
              user?.name?.charAt(0)
            }

          </div>

        </div>

      </div>

      {/* ORDERS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {
          orders.map((order) => (

            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-xl p-8"
            >

              {/* TOP */}

              <div className="flex justify-between items-start mb-8">

                <div>

                  <h2 className="text-5xl font-bold mb-8">

                    #
                    {
                      order._id.slice(-6)
                    }

                  </h2>

                  <h3 className="text-3xl font-bold">

                    {
                      order.customerName
                    }

                  </h3>

                  <p className="text-gray-500 text-2xl mt-2">

                    {
                      order.customerPhone
                    }

                  </p>

                  <p className="text-gray-500 text-2xl mt-2">

                    {
                      order.address
                    }

                  </p>

                </div>

                {/* STATUS */}

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

              {/* PRODUCTS */}

              <div className="mb-8">

                <h3 className="text-3xl font-bold mb-6">

                  Products

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
                          className="flex justify-between bg-gray-100 rounded-2xl px-5 py-5"
                        >

                          <span className="text-2xl">

                            {
                              item.name
                            }

                          </span>

                          <span className="font-bold text-2xl">

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

              {/* TOTAL */}

              <h2 className="text-5xl font-bold text-green-600 mb-10">

                ₹
                {
                  order.totalAmount
                }

              </h2>

              {/* BUTTONS */}

              {
                order.orderStatus ===
                "PLACED" ? (

                  <button
                    onClick={() =>
                      acceptOrder(
                        order._id
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full py-6 rounded-3xl font-bold text-3xl"
                  >

                    Start Picking

                  </button>

                ) : (

                  <button
                    onClick={() =>
                      readyOrder(
                        order._id
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white w-full py-6 rounded-3xl font-bold text-3xl flex justify-center items-center gap-4"
                  >

                    <FaCheckCircle />

                    Mark Ready

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

export default PickerDashboard;
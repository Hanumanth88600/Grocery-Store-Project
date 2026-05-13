import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AdminLayout from "../layout/AdminLayout";

const OrdersPage = () => {

  const [orders, setOrders] =
    useState([]);

  const [staff, setStaff] =
    useState([]);

  // FETCH ORDERS

  const fetchOrders = async () => {

    const { data } =
      await axios.get(
        "http://localhost:5000/api/orders"
      );

    setOrders(data);
  };

  // FETCH STAFF

  const fetchStaff = async () => {

    const { data } =
      await axios.get(
        "http://localhost:5000/api/staff"
      );

    setStaff(data);
  };

  useEffect(() => {

    fetchOrders();

    fetchStaff();

  }, []);

  // ASSIGN PICKER

  const assignPicker =
    async (
      orderId,
      pickerId
    ) => {

      if (!pickerId) return;

      try {

        await axios.put(
          `http://localhost:5000/api/orders/assign-picker/${orderId}`,
          {
            pickerId,
          }
        );

        fetchOrders();

      } catch (error) {

        alert(
          error.response?.data
            ?.message
        );
      }
    };

  // ASSIGN DELIVERY

  const assignDelivery =
    async (
      orderId,
      deliveryId
    ) => {

      if (!deliveryId) return;

      try {

        await axios.put(
          `http://localhost:5000/api/orders/assign-delivery/${orderId}`,
          {
            deliveryId,
          }
        );

        fetchOrders();

      } catch (error) {

        alert(
          error.response?.data
            ?.message
        );
      }
    };

  // ADMIN RECEIVE CASH

  const receiveCash =
    async (id) => {

      try {

        await axios.put(
          `http://localhost:5000/api/orders/admin-cash/${id}`
        );

        fetchOrders();

      } catch (error) {

        console.log(error);
      }
    };

  // STATUS COLORS

  const getStatusStyle =
    (status) => {

      switch (status) {

        case "PLACED":
          return "bg-blue-100 text-blue-700";

        case "PICKING":
          return "bg-yellow-100 text-yellow-700";

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

    <AdminLayout>

      <h1 className="text-5xl font-bold mb-8">

        Orders Management

      </h1>

      <div className="space-y-6">

        {
          orders.map((order) => {

            const pickerLocked =

              order.orderStatus ===
                "PICKING" ||

              order.orderStatus ===
                "READY" ||

              order.orderStatus ===
                "OUT_FOR_DELIVERY" ||

              order.orderStatus ===
                "DELIVERED" ||

              order.orderStatus ===
                "CANCELLED";

            const deliveryLocked =

              order.orderStatus ===
                "OUT_FOR_DELIVERY" ||

              order.orderStatus ===
                "DELIVERED" ||

              order.orderStatus ===
                "CANCELLED";

            return (

              <div
                key={order._id}
                className="bg-white p-6 rounded-3xl shadow-xl"
              >

                {/* TOP */}

                <div className="flex flex-col xl:flex-row justify-between gap-6">

                  {/* CUSTOMER */}

                  <div>

                    <h2 className="text-2xl font-bold">

                      {order.customerName}

                    </h2>

                    <p className="text-gray-500">

                      {order.customerPhone}

                    </p>

                    <p className="mt-2">

                      {order.address}

                    </p>

                    <p className="mt-3 text-gray-400 font-bold">

                      Order ID:
                      {" "}
                      #
                      {order._id.slice(-6)}

                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="flex flex-col items-end gap-3">

                    <span
                      className={`${getStatusStyle(
                        order.orderStatus
                      )} px-4 py-2 rounded-xl font-bold`}
                    >

                      {order.orderStatus}

                    </span>

                    <span className={`px-4 py-2 rounded-xl font-bold ${
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

                </div>

                {/* PRODUCTS */}

                <div className="mt-6">

                  <h3 className="text-xl font-bold mb-3">

                    Ordered Products

                  </h3>

                  <div className="space-y-2">

                    {
                      order.products.map(
                        (
                          product,
                          index
                        ) => (

                          <div
                            key={index}
                            className="flex justify-between border-b pb-2"
                          >

                            <span>

                              {product.name}

                            </span>

                            <span>

                              Qty:
                              {
                                product.quantity
                              }

                            </span>

                          </div>
                        )
                      )
                    }

                  </div>

                </div>

                {/* TOTAL */}

                <div className="mt-5 text-2xl font-bold text-green-600">

                  ₹{order.totalAmount}

                </div>

                {/* ASSIGNED STAFF */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

                  {/* PICKER */}

                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">

                    <h3 className="text-lg font-bold text-blue-700 mb-2">

                      Assigned Picker

                    </h3>

                    {
                      order.picker ? (

                        <div>

                          <p className="font-bold text-xl">

                            {order.picker.name}

                          </p>

                          <p className="text-gray-500">

                            {order.picker.email}

                          </p>

                        </div>

                      ) : (

                        <p className="text-gray-400">

                          No Picker Assigned

                        </p>
                      )
                    }

                  </div>

                  {/* DELIVERY */}

<div className="bg-orange-50 border border-orange-200 rounded-3xl p-6">

  <h3 className="text-2xl font-bold text-orange-700 mb-4">

    Assigned Delivery Agent

  </h3>

  {
    order.deliveryAgent ? (

      <div>

        <p className="font-bold text-3xl">

          {
            order.deliveryAgent.name
          }

        </p>

        <p className="text-gray-500 text-xl mt-2">

          {
            order.deliveryAgent.email
          }

        </p>

      </div>

    ) : (

      <p className="text-gray-400 text-xl">

        Waiting For Auto Assignment

      </p>
    )
  }

</div>

                </div>

                {/* COD SETTLEMENT */}

                {
                  order.paymentMethod ===
                    "COD" && (

                    <div className="mt-6 bg-yellow-50 border border-yellow-200 p-5 rounded-2xl">

                      <h2 className="text-2xl font-bold mb-4">

                        COD Settlement

                      </h2>

                      <p className="text-lg mb-2">

                        Cash Collected:
                        {" "}
                        {
                          order.cashReceived
                            ? "YES"
                            : "NO"
                        }

                      </p>

                      <p className="text-lg mb-5">

                        Amount:
                        {" "}
                        ₹
                        {
                          order.cashCollectedAmount
                        }

                      </p>

                      {
                        order.cashReceived &&

                        !order.adminCashReceived && (

                          <button
                            onClick={() =>
                              receiveCash(
                                order._id
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold"
                          >

                            Cash Received From Agent

                          </button>
                        )
                      }

                      {
                        order.adminCashReceived && (

                          <div className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl font-bold inline-block">

                            Admin Received Cash

                          </div>
                        )
                      }

                    </div>
                  )
                }

                {/* ASSIGN SECTION */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                  {/* PICKER */}

                  <select
                    disabled={
                      pickerLocked
                    }
                    onChange={(e) =>
                      assignPicker(
                        order._id,
                        e.target.value
                      )
                    }
                    className="border p-4 rounded-2xl disabled:bg-gray-200"
                  >

                    <option value="">

                      {
                        order.picker
                          ? "Picker Assigned"
                          : "Assign Picker"
                      }

                    </option>

                    {
                      staff
                        .filter(
                          (s) =>
                            s.role ===
                            "picker"
                        )
                        .map((picker) => (

                          <option
                            key={picker._id}
                            value={picker._id}
                          >

                            {picker.name}

                          </option>
                        ))
                    }

                  </select>

                  {/* DELIVERY */}

                  <select
                    disabled={
                      deliveryLocked ||
                      order.orderStatus !==
                        "READY"
                    }
                    onChange={(e) =>
                      assignDelivery(
                        order._id,
                        e.target.value
                      )
                    }
                    className="border p-4 rounded-2xl disabled:bg-gray-200"
                  >

                    <option value="">

                      {
                        order.deliveryAgent
                          ? "Delivery Assigned"
                          : "Assign Delivery Agent"
                      }

                    </option>

                    {
                      staff
                        .filter(
                          (s) =>
                            s.role ===
                            "delivery"
                        )
                        .map(
                          (
                            delivery
                          ) => (

                            <option
                              key={
                                delivery._id
                              }
                              value={
                                delivery._id
                              }
                            >

                              {
                                delivery.name
                              }

                            </option>
                          )
                        )
                    }

                  </select>

                </div>

              </div>
            );
          })
        }

      </div>

    </AdminLayout>
  );
};

export default OrdersPage;
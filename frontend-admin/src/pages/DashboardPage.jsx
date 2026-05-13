import React,
{
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AdminLayout from "../layout/AdminLayout";

import {
  Line,
  Doughnut,
  Bar,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  FaShoppingCart,
  FaRupeeSign,
  FaBox,
  FaMotorcycle,
} from "react-icons/fa";

import { motion }
from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const DashboardPage = () => {

  const [dashboardData,
    setDashboardData] =
    useState(null);

  // FETCH DATA

  const fetchDashboard =
    async () => {

      try {

        const { data } =
          await axios.get(
            "http://localhost:5000/api/admin/dashboard"
          );

        setDashboardData(data);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchDashboard();

  }, []);

  // LOADING

  if (!dashboardData) {

    return (

      <AdminLayout>

        <div className="text-4xl font-bold p-10">

          Loading Dashboard...

        </div>

      </AdminLayout>
    );
  }

  // CHART DATA

  const salesData = {

    labels: [
      "Placed",
      "Picking",
      "Ready",
      "Delivery",
      "Delivered",
    ],

    datasets: [
      {
        label: "Orders",

        data: [

          dashboardData.orderStatusData.placed,

          dashboardData.orderStatusData.picking,

          dashboardData.orderStatusData.ready,

          dashboardData.orderStatusData.outForDelivery,

          dashboardData.orderStatusData.delivered,
        ],

        borderColor: "#22c55e",

        backgroundColor:
          "rgba(34,197,94,0.2)",

        tension: 0.4,

        fill: true,
      },
    ],
  };

  const doughnutData = {

    labels: [
      "Delivered",
      "Placed",
      "Picking",
      "Ready",
      "Out For Delivery",
    ],

    datasets: [
      {
        data: [

          dashboardData.orderStatusData.delivered,

          dashboardData.orderStatusData.placed,

          dashboardData.orderStatusData.picking,

          dashboardData.orderStatusData.ready,

          dashboardData.orderStatusData.outForDelivery,
        ],

        backgroundColor: [
          "#22c55e",
          "#eab308",
          "#3b82f6",
          "#a855f7",
          "#f97316",
        ],
      },
    ],
  };

  const revenueData = {

    labels: [
      "Revenue",
    ],

    datasets: [
      {
        label: "Revenue",

        data: [
          dashboardData.totalRevenue,
        ],

        backgroundColor: [
          "#22c55e",
        ],
      },
    ],
  };

  return (

    <AdminLayout>

      {/* TOP CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        {/* ORDERS */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-3xl shadow-xl"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-xl">

                Total Orders

              </p>

              <h2 className="text-5xl font-bold mt-3">

                {
                  dashboardData.totalOrders
                }

              </h2>

            </div>

            <FaShoppingCart size={55} />

          </div>

        </motion.div>

        {/* REVENUE */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-xl"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-xl">

                Revenue

              </p>

              <h2 className="text-5xl font-bold mt-3">

                ₹{
                  dashboardData.totalRevenue
                }

              </h2>

            </div>

            <FaRupeeSign size={55} />

          </div>

        </motion.div>

        {/* PRODUCTS */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-3xl shadow-xl"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-xl">

                Products

              </p>

              <h2 className="text-5xl font-bold mt-3">

                {
                  dashboardData.totalProducts
                }

              </h2>

            </div>

            <FaBox size={55} />

          </div>

        </motion.div>

        {/* DELIVERY */}

        <motion.div
          whileHover={{
            scale: 1.03,
          }}
          className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 rounded-3xl shadow-xl"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-xl">

                Delivery Agents

              </p>

              <h2 className="text-5xl font-bold mt-3">

                {
                  dashboardData.deliveryAgents
                }

              </h2>

            </div>

            <FaMotorcycle size={55} />

          </div>

        </motion.div>

      </div>

      {/* CHARTS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {/* LINE */}

        <motion.div
          className="bg-white p-6 rounded-3xl shadow-xl"
        >

          <h2 className="text-3xl font-bold mb-6">

            Order Flow

          </h2>

          <Line data={salesData} />

        </motion.div>

        {/* DOUGHNUT */}

        <motion.div
          className="bg-white p-6 rounded-3xl shadow-xl"
        >

          <h2 className="text-3xl font-bold mb-6">

            Orders Overview

          </h2>

          <div className="w-80 mx-auto">

            <Doughnut
              data={doughnutData}
            />

          </div>

        </motion.div>

      </div>

      {/* LOWER */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* PRODUCTS */}

        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-6">

            Top Products

          </h2>

          <div className="space-y-5">

            {
              dashboardData.topProducts.map(
                (item) => (

                  <div
                    key={item._id}
                    className="flex justify-between border-b pb-3"
                  >

                    <span className="text-lg">

                      {item.name}

                    </span>

                    <span className="font-bold text-lg">

                      Stock:
                      {" "}
                      {item.stock}

                    </span>

                  </div>
                )
              )
            }

          </div>

        </div>

        {/* RECENT ORDERS */}

        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-6">

            Recent Orders

          </h2>

          <div className="space-y-5">

            {
              dashboardData.recentOrders.map(
                (order) => (

                  <div
                    key={order._id}
                    className="flex justify-between"
                  >

                    <div>

                      <p className="font-bold text-lg">

                        {
                          order.customerName
                        }

                      </p>

                      <p className="text-gray-500">

                        #
                        {
                          order._id.slice(-6)
                        }

                      </p>

                    </div>

                    <span className="bg-green-100 text-green-600 px-3 py-2 rounded-xl">

                      {
                        order.orderStatus
                      }

                    </span>

                  </div>
                )
              )
            }

          </div>

        </div>

        {/* REVENUE */}

        <div className="bg-white p-6 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-6">

            Revenue Analytics

          </h2>

          <Bar data={revenueData} />

        </div>

      </div>

    </AdminLayout>
  );
};

export default DashboardPage;
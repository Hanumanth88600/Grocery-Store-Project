import React,
{
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AdminLayout from "../layout/AdminLayout";

import {
  Bar,
  Pie,
  Line,
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

const AnalyticsPage = () => {

  const [data,
    setData] =
    useState(null);

  // FETCH

  const fetchAnalytics =
    async () => {

      try {

        const response =
          await axios.get(
            "https://grocery-store-project-l9y7.onrender.com/api/admin/dashboard"
          );

        setData(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchAnalytics();

  }, []);

  // LOADING

  if (!data) {

    return (

      <AdminLayout>

        <div className="text-4xl font-bold p-10">

          Loading Analytics...

        </div>

      </AdminLayout>
    );
  }

  // REVENUE CHART

  const revenueData = {

    labels: [
      "Revenue",
    ],

    datasets: [
      {
        label: "Revenue",

        data: [
          data.totalRevenue,
        ],

        backgroundColor: [
          "#22c55e",
        ],
      },
    ],
  };

  // ORDER STATUS

  const orderData = {

    labels: [
      "Placed",
      "Picking",
      "Ready",
      "Out For Delivery",
      "Delivered",
    ],

    datasets: [
      {
        data: [

          data.orderStatusData.placed,

          data.orderStatusData.picking,

          data.orderStatusData.ready,

          data.orderStatusData.outForDelivery,

          data.orderStatusData.delivered,
        ],

        backgroundColor: [
          "#facc15",
          "#3b82f6",
          "#a855f7",
          "#f97316",
          "#22c55e",
        ],
      },
    ],
  };

  // LINE DATA

  const lineData = {

    labels: [
      "Orders",
      "Products",
      "Delivery Agents",
    ],

    datasets: [
      {
        label: "System Data",

        data: [

          data.totalOrders,

          data.totalProducts,

          data.deliveryAgents,
        ],

        borderColor: "#22c55e",

        backgroundColor:
          "rgba(34,197,94,0.2)",

        tension: 0.4,

        fill: true,
      },
    ],
  };

  return (

    <AdminLayout>

      <h1 className="text-5xl font-bold mb-10">

        Analytics Dashboard

      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* BAR */}

        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-6">

            Revenue Analytics

          </h2>

          <Bar data={revenueData} />

        </div>

        {/* PIE */}

        <div className="bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-bold mb-6">

            Orders Analytics

          </h2>

          <div className="w-80 mx-auto">

            <Pie data={orderData} />

          </div>

        </div>

      </div>

      {/* LINE */}

      <div className="bg-white p-8 rounded-3xl shadow-xl mt-8">

        <h2 className="text-3xl font-bold mb-6">

          Overall System Analytics

        </h2>

        <Line data={lineData} />

      </div>

    </AdminLayout>
  );
};

export default AnalyticsPage;
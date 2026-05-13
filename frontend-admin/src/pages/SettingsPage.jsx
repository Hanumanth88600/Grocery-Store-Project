import React,
{
  useState,
} from "react";

import AdminLayout from "../layout/AdminLayout";

const SettingsPage = () => {

  const [storeName,
    setStoreName] =
    useState("Blinkit Clone");

  const [deliveryTime,
    setDeliveryTime] =
    useState("10");

  const saveSettings =
    () => {

      alert(
        "Settings Saved Successfully"
      );
    };

  return (

    <AdminLayout>

      <h1 className="text-5xl font-bold mb-10">

        Settings

      </h1>

      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl">

        {/* STORE NAME */}

        <div className="mb-6">

          <label className="block text-xl font-bold mb-3">

            Store Name

          </label>

          <input
            type="text"
            value={storeName}
            onChange={(e) =>
              setStoreName(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl"
          />

        </div>

        {/* DELIVERY */}

        <div className="mb-6">

          <label className="block text-xl font-bold mb-3">

            Delivery Time (Minutes)

          </label>

          <input
            type="number"
            value={deliveryTime}
            onChange={(e) =>
              setDeliveryTime(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl"
          />

        </div>

        {/* BUTTON */}

        <button
          onClick={saveSettings}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-xl font-bold"
        >

          Save Settings

        </button>

      </div>

    </AdminLayout>
  );
};

export default SettingsPage;
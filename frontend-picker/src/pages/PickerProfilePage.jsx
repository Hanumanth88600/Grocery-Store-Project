import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  FaUserCircle,
} from "react-icons/fa";

const PickerProfilePage = () => {

  const user =
    JSON.parse(
      localStorage.getItem(
        "user"
      )
    );

  const [profile,
    setProfile] =
    useState(null);

  const [orders,
    setOrders] =
    useState([]);

  // FETCH PROFILE

  const fetchProfile =
    async () => {

      try {

        const { data } =
          await axios.get(
            `https://grocery-store-project-l9y7.onrender.com/api/profile/${user._id}`
          );

        setProfile(data);

      } catch (error) {

        console.log(error);
      }
    };

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
              order.picker?._id ===
              user._id
          );

        setOrders(filtered);

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchProfile();

    fetchOrders();

  }, []);

  // UPDATE PROFILE

  const updateProfile =
    async () => {

      try {

        await axios.put(
          `https://grocery-store-project-l9y7.onrender.com/api/profile/update/${user._id}`,
          profile
        );

        localStorage.setItem(
          "user",
          JSON.stringify(profile)
        );

        alert(
          "Profile Updated"
        );

      } catch (error) {

        console.log(error);
      }
    };

  if (!profile) {

    return (
      <div className="text-center mt-20 text-4xl font-bold">

        Loading...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-8">

      {/* HEADER */}

      <div className="flex items-center gap-5 mb-10">

        {
          profile.avatar ? (

            <img
              src={profile.avatar}
              alt=""
              className="w-28 h-28 rounded-full object-cover border-4 border-green-500"
            />

          ) : (

            <FaUserCircle
              className="text-green-600"
              size={100}
            />
          )
        }

        <div>

          <h1 className="text-5xl font-bold">

            {profile.name}

          </h1>

          <p className="text-gray-500 mt-2 text-xl">

            {profile.email}

          </p>

        </div>

      </div>

      {/* PROFILE */}

      <div className="bg-white p-8 rounded-3xl shadow-xl">

        <h2 className="text-3xl font-bold mb-6">

          Edit Profile

        </h2>

        <div className="space-y-5">

          <input
            type="text"
            placeholder="Avatar URL"
            value={
              profile.avatar || ""
            }
            onChange={(e) =>
              setProfile({

                ...profile,

                avatar:
                  e.target.value,
              })
            }
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            value={
              profile.name
            }
            onChange={(e) =>
              setProfile({

                ...profile,

                name:
                  e.target.value,
              })
            }
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            value={
              profile.phone || ""
            }
            onChange={(e) =>
              setProfile({

                ...profile,

                phone:
                  e.target.value,
              })
            }
            className="w-full border p-4 rounded-2xl"
          />

          <button
            onClick={
              updateProfile
            }
            className="bg-green-600 text-white px-6 py-4 rounded-2xl font-bold"
          >

            Save Profile

          </button>

        </div>

      </div>

      {/* ORDERS */}

      <div className="bg-white p-8 rounded-3xl shadow-xl mt-10">

        <h2 className="text-3xl font-bold mb-8">

          Previous Orders

        </h2>

        <div className="space-y-5">

          {
            orders.map((order) => (

              <div
                key={order._id}
                className="border p-5 rounded-2xl"
              >

                <div className="flex justify-between">

                  <h2 className="text-2xl font-bold">

                    #{order._id.slice(-6)}

                  </h2>

                  <span className="font-bold text-green-600">

                    {order.orderStatus}

                  </span>

                </div>

                <p className="mt-3">

                  Customer:
                  {" "}
                  {order.customerName}

                </p>

                <p className="mt-2">

                  Amount:
                  {" "}
                  ₹{order.totalAmount}

                </p>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
};

export default PickerProfilePage;
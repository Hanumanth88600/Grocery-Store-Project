import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import AdminLayout from "../layout/AdminLayout";

import {
  FaTrash,
  FaPlus,
  FaMotorcycle,
  FaBoxOpen,
} from "react-icons/fa";

const DeliveryAgentsPage = () => {

  const [showModal, setShowModal] =
    useState(false);

  const [staff, setStaff] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      role: "delivery",
      phone: "",
      warehouse: "",
    });

  // FETCH STAFF

  const fetchStaff = async () => {

    try {

      const { data } =
        await axios.get(
          "http://localhost:5000/api/staff"
        );

      setStaff(data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchStaff();

  }, []);

  // CHANGE HANDLER

  const changeHandler = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD STAFF

  const addStaffHandler =
    async () => {

      try {

        await axios.post(
          "http://localhost:5000/api/staff",
          formData
        );

        fetchStaff();

        setShowModal(false);

      } catch (error) {

        console.log(error);
      }
    };

  // DELETE STAFF

  const deleteHandler =
    async (id) => {

      try {

        await axios.delete(
          `http://localhost:5000/api/staff/${id}`
        );

        fetchStaff();

      } catch (error) {

        console.log(error);
      }
    };

  return (
    <AdminLayout>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-5xl font-bold">
          Staff Management
        </h1>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-2xl flex items-center gap-3"
        >

          <FaPlus />

          Add Staff

        </button>

      </div>

      {/* STAFF GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {
          staff.map((user) => (

            <div
              key={user._id}
              className="bg-white rounded-3xl shadow-xl p-6"
            >

              <div className="flex justify-between items-center mb-5">

                <div className="flex items-center gap-4">

                  {
                    user.role ===
                    "delivery" ? (

                      <FaMotorcycle className="text-4xl text-orange-500" />

                    ) : (

                      <FaBoxOpen className="text-4xl text-blue-500" />

                    )
                  }

                  <div>

                    <h2 className="text-2xl font-bold">
                      {user.name}
                    </h2>

                    <p className="text-gray-500">
                      {user.role}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() =>
                    deleteHandler(user._id)
                  }
                  className="text-red-600 text-2xl"
                >

                  <FaTrash />

                </button>

              </div>

              <div className="space-y-2">

                <p>
                  <strong>Email:</strong>{" "}
                  {user.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {user.phone}
                </p>

                <p>
                  <strong>Warehouse:</strong>{" "}
                  {user.warehouse}
                </p>

              </div>

            </div>
          ))
        }

      </div>

      {/* MODAL */}

      {
        showModal && (

          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">

            <div className="bg-white w-full max-w-2xl rounded-3xl p-8">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-4xl font-bold">
                  Add Staff
                </h2>

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="text-3xl"
                >
                  ✕
                </button>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <input
                  type="text"
                  placeholder="Warehouse"
                  name="warehouse"
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                />

                <select
                  name="role"
                  onChange={changeHandler}
                  className="border p-4 rounded-2xl"
                >

                  <option value="delivery">
                    Delivery Agent
                  </option>

                  <option value="picker">
                    Picker
                  </option>

                </select>

              </div>

              <button
                onClick={addStaffHandler}
                className="bg-green-600 hover:bg-green-700 text-white w-full py-4 rounded-2xl mt-6 text-xl font-bold"
              >

                Create Staff

              </button>

            </div>

          </div>
        )
      }

    </AdminLayout>
  );
};

export default DeliveryAgentsPage;
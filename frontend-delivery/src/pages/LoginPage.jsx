import React, {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

const LoginPage = () => {

  const navigate =
    useNavigate();

  const [isRegister,
    setIsRegister] =
    useState(false);

  const [formData,
    setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

      phone: "",

      warehouse: "",
    });

  const changeHandler =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  // LOGIN / REGISTER

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        // LOGIN

        if (!isRegister) {

          const { data } =
            await axios.post(
              "https://grocery-store-project-l9y7.onrender.com/api/auth/login",
              {

                email:
                  formData.email,

                password:
                  formData.password,
              }
            );

       if (
  data.user.role !==
  "delivery"
) {

  alert(
    "Only Delivery Agents Allowed"
  );

  return;
}

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          navigate(
            "/delivery-dashboard"
          );

        }

        // REGISTER

        else {

          const { data } =
            await axios.post(
              "https://grocery-store-project-l9y7.onrender.com/api/auth/register",
              {

                ...formData,

                role:
                  "delivery",
              }
            );

          localStorage.setItem(
            "token",
            data.token
          );

          localStorage.setItem(
            "user",
            JSON.stringify(
              data.user
            )
          );

          alert(
            "Delivery Account Created"
          );

          navigate(
            "/delivery-dashboard"
          );
        }

      } catch (error) {

        alert(
          error.response?.data
            ?.message ||
            "Something went wrong"
        );
      }
    };

  return (

    <div className="min-h-screen flex justify-center items-center bg-orange-100 p-4">

      <form
        onSubmit={
          submitHandler
        }
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
      >

        <h1 className="text-4xl font-bold text-center text-orange-600 mb-2">

          {
            isRegister
              ? "Delivery Register"
              : "Delivery Login"
          }

        </h1>

        <p className="text-center text-gray-500 mb-8">

          Blinkit Delivery Portal

        </p>

        {/* NAME */}

        {
          isRegister && (

            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={
                formData.name
              }
              onChange={
                changeHandler
              }
              className="w-full border p-4 rounded-2xl mb-5"
              required
            />
          )
        }

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={
            formData.email
          }
          onChange={
            changeHandler
          }
          className="w-full border p-4 rounded-2xl mb-5"
          required
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          name="password"
          value={
            formData.password
          }
          onChange={
            changeHandler
          }
          className="w-full border p-4 rounded-2xl mb-5"
          required
        />

        {/* PHONE */}

        {
          isRegister && (

            <input
              type="text"
              placeholder="Phone Number"
              name="phone"
              value={
                formData.phone
              }
              onChange={
                changeHandler
              }
              className="w-full border p-4 rounded-2xl mb-5"
            />
          )
        }

        {/* WAREHOUSE */}

        {
          isRegister && (

            <input
              type="text"
              placeholder="Warehouse"
              name="warehouse"
              value={
                formData.warehouse
              }
              onChange={
                changeHandler
              }
              className="w-full border p-4 rounded-2xl mb-5"
            />
          )
        }

        {/* FORGOT PASSWORD */}

        {
          !isRegister && (

            <div className="text-right mb-5">

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Forgot Password Feature Coming Soon"
                  )
                }
                className="text-orange-600 font-semibold"
              >

                Forgot Password?

              </button>

            </div>
          )
        }

        {/* BUTTON */}

        <button
          className="w-full bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-2xl text-xl font-bold"
        >

          {
            isRegister
              ? "Register"
              : "Login"
          }

        </button>

        {/* SWITCH */}

        <div className="text-center mt-6">

          <button
            type="button"
            onClick={() =>
              setIsRegister(
                !isRegister
              )
            }
            className="text-orange-700 font-bold"
          >

            {
              isRegister
                ? "Already have an account? Login"
                : "Don't have an account? Register"
            }

          </button>

        </div>

      </form>

    </div>
  );
};

export default LoginPage;
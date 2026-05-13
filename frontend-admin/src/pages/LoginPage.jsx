import React, {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

import {
  FaUserShield,
} from "react-icons/fa";

const LoginPage = () => {

  const navigate =
    useNavigate();

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  // LOGIN

  const loginHandler =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const { data } =
          await axios.post(
            "http://localhost:5000/api/auth/login",
            {
              email,
              password,
            }
          );

        console.log(data);

        // FIXED ROLE CHECK

        if (
          data.user.role !==
          "admin"
        ) {

          alert(
            "Only Admin Allowed"
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
          "/dashboard"
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data
            ?.message ||
            "Login Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-100 to-green-200 p-4">

      <form
        onSubmit={
          loginHandler
        }
        className="bg-white w-full max-w-lg p-10 rounded-3xl shadow-2xl"
      >

        {/* ICON */}

        <div className="flex justify-center mb-6">

          <div className="bg-green-600 text-white p-5 rounded-full">

            <FaUserShield
              size={45}
            />

          </div>

        </div>

        {/* TITLE */}

        <h2 className="text-4xl font-bold text-center text-green-600 mb-2">

          Admin Login

        </h2>

        <p className="text-center text-gray-500 mb-8">

          Blinkit Admin Panel

        </p>

        {/* EMAIL */}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full border p-4 rounded-2xl mb-5"
          required
        />

        {/* PASSWORD */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border p-4 rounded-2xl mb-5"
          required
        />

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition text-white p-4 rounded-2xl text-xl font-bold"
        >

          {
            loading
              ? "Please wait..."
              : "Login"
          }

        </button>

      </form>

    </div>
  );
};

export default LoginPage;
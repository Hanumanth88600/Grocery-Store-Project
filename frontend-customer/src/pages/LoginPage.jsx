import React,
{
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

const LoginPage = () => {

  const navigate =
    useNavigate();

  const [isLogin,
    setIsLogin] =
    useState(true);

  const [formData,
    setFormData] =
    useState({

      name: "",

      email: "",

      password: "",

      phone: "",
    });

  // CHANGE HANDLER

  const changeHandler =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,
      });
    };

  // SUBMIT

  const submitHandler =
    async (e) => {

      e.preventDefault();

      try {

        const url =
          isLogin

            ? "http://localhost:5000/api/auth/login"

            : "http://localhost:5000/api/auth/register";

        const { data } =
          await axios.post(
            url,
            formData
          );

        // SAVE

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

        const redirect =
  localStorage.getItem(
    "redirectAfterLogin"
  );

if (redirect) {

  localStorage.removeItem(
    "redirectAfterLogin"
  );

  navigate(redirect);

} else {

  navigate("/");
}

      } catch (error) {

        alert(
          error.response?.data
            ?.message
        );
      }
    };

  return (

    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-8">

          {
            isLogin
              ? "Customer Login"
              : "Create Account"
          }

        </h1>

        <form
          onSubmit={
            submitHandler
          }
          className="space-y-5"
        >

          {
            !isLogin && (

              <>
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  onChange={
                    changeHandler
                  }
                  className="w-full border p-4 rounded-2xl"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  name="phone"
                  onChange={
                    changeHandler
                  }
                  className="w-full border p-4 rounded-2xl"
                />
              </>
            )
          }

          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={
              changeHandler
            }
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={
              changeHandler
            }
            className="w-full border p-4 rounded-2xl"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-xl"
          >

            {
              isLogin
                ? "Login"
                : "Register"
            }

          </button>

        </form>

        <p className="text-center mt-6">

          {
            isLogin
              ? "Don't have account?"
              : "Already have account?"
          }

          <button
            onClick={() =>
              setIsLogin(
                !isLogin
              )
            }
            className="text-green-600 font-bold ml-2"
          >

            {
              isLogin
                ? "Register"
                : "Login"
            }

          </button>

        </p>

      </div>

    </div>
  );
};

export default LoginPage;
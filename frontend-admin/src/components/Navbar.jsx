import React, { useState } from "react";

import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";

const Navbar = () => {

  const [showMenu, setShowMenu] = useState(false);

  const logoutHandler = () => {

    localStorage.removeItem("adminInfo");

    window.location.href = "/";
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">

      <h1 className="text-4xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-6">

        {/* SEARCH */}

        <div className="hidden md:flex items-center bg-gray-100 px-4 py-3 rounded-2xl">

          <FaSearch className="text-gray-500 mr-3" />

          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent outline-none w-52"
          />

        </div>

        {/* BELL */}

        <div className="relative">

          <FaBell className="text-2xl text-gray-700 cursor-pointer" />

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex justify-center items-center">
            5
          </span>

        </div>

        {/* PROFILE */}

        <div className="relative">

          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >

            <FaUserCircle className="text-5xl text-green-600" />

            <div className="hidden md:block">

              <p className="font-bold text-lg">
                Admin
              </p>

              <p className="text-gray-500 text-sm">
                admin@blinkit.com
              </p>

            </div>

          </div>

          {/* DROPDOWN */}

          {
            showMenu && (
              <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden">

                <button className="flex items-center gap-3 w-full px-5 py-4 hover:bg-gray-100">

                  <FaUserEdit />

                  Edit Profile

                </button>

                <button
                  onClick={logoutHandler}
                  className="flex items-center gap-3 w-full px-5 py-4 hover:bg-red-50 text-red-600"
                >

                  <FaSignOutAlt />

                  Logout

                </button>

              </div>
            )
          }

        </div>

      </div>

    </div>
  );
};

export default Navbar;
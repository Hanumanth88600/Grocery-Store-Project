import React from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaMotorcycle,
  FaChartPie,
  FaTags,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {

  // ACTIVE STYLE

  const navStyle =
    ({ isActive }) =>

      `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-white text-green-600 font-bold"
          : "hover:bg-green-700"
      }`;

  return (

    <div className="w-64 bg-green-600 text-white min-h-screen fixed hidden md:block shadow-xl">

      {/* LOGO */}

      <div className="p-5 text-4xl font-bold border-b border-green-400">

        Blinkit Admin

      </div>

      {/* LINKS */}

      <div className="flex flex-col gap-3 p-5 text-lg">

        {/* DASHBOARD */}

        <NavLink
          to="/dashboard"
          className={navStyle}
        >

          <FaTachometerAlt />

          Dashboard

        </NavLink>

        {/* PRODUCTS */}

        <NavLink
          to="/products"
          className={navStyle}
        >

          <FaBox />

          Products

        </NavLink>

        {/* ORDERS */}

        <NavLink
          to="/orders"
          className={navStyle}
        >

          <FaClipboardList />

          Orders

        </NavLink>

        {/* DELIVERY */}

        <NavLink
          to="/delivery-agents"
          className={navStyle}
        >

          <FaMotorcycle />

          Staff Details

        </NavLink>

        {/* ANALYTICS */}

        <NavLink
          to="/analytics"
          className={navStyle}
        >

          <FaChartPie />

          Analytics

        </NavLink>

        {/* CATEGORIES */}

        <NavLink
          to="/categories"
          className={navStyle}
        >

          <FaTags />

          Categories

        </NavLink>

        {/* SETTINGS */}

        <NavLink
          to="/settings"
          className={navStyle}
        >

          <FaCog />

          Settings

        </NavLink>

      </div>

    </div>
  );
};

export default Sidebar;
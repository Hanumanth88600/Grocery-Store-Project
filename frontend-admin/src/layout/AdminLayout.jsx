import React from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

const AdminLayout = ({ children }) => {

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64">

        <Navbar />

        <div className="p-4 md:p-8">
          {children}
        </div>

      </div>

    </div>
  );
};

export default AdminLayout;
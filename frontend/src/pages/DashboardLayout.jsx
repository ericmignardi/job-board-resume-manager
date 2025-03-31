import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-base-300 text-white fixed h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 bg-base-200 flex flex-col">
        <div className="sticky top-0 bg-transparent shadow-md z-10">
          <Navbar />
        </div>
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

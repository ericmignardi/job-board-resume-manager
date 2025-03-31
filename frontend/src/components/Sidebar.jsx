import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaFile, FaUser, FaBriefcase } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="flex flex-col justify-start gap-6 text-white p-6 h-screen w-64 fixed">
      <h3 className="text-2xl font-bold text-center text-primary">hired.io</h3>
      <nav className="flex flex-col gap-4">
        <ul className="flex flex-col gap-3">
          <li>
            <Link
              to="/dashboard/overview"
              className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-700 transition"
            >
              <FaHome />
              Overview
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/jobs"
              className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-700 transition"
            >
              <FaBriefcase />
              Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/applications"
              className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-700 transition"
            >
              <FaFile />
              Applications
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/profile"
              className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-700 transition"
            >
              <FaUser />
              Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

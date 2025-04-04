import React from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaFile,
  FaUser,
  FaBriefcase,
} from "react-icons/fa";

const Sidebar = () => {
  const { authUser } = useAuthStore();

  if (!authUser) return null; // Prevent sidebar from rendering if user is not logged in

  return (
    <div className="flex flex-col justify-start items-center gap-4 p-4 h-screen">
      <h3 className="text-2xl text-primary">Job Board</h3>
      <nav className="flex flex-col gap-4 justify-center items-center">
        <ul className="flex flex-col gap-4 items-start">
          {authUser.role === "job_seeker" ? (
            <>
              <li>
                <Link
                  to="/dashboard/jobs"
                  className="flex gap-4 items-center link link-hover"
                >
                  <FaMoneyBill /> Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/applications"
                  className="flex gap-4 items-center link link-hover"
                >
                  <FaFile /> Applications
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/dashboard/employer/jobs"
                  className="flex gap-4 items-center link link-hover"
                >
                  <FaBriefcase /> Manage Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/employer/applications"
                  className="flex gap-4 items-center link link-hover"
                >
                  <FaFile /> Applications
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/dashboard/profile"
              className="flex gap-4 items-center link link-hover"
            >
              <FaUser /> Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

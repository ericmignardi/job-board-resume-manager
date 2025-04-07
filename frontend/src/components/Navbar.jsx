import React from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full flex justify-end p-4">
      <nav>
        <ul className="flex justify-center items-center gap-4">
          <li>
            <button
              className="btn btn-primary rounded-full"
              onClick={handleClick}
            >
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  useEffect(() => {
    if (authUser) navigate("/dashboard");
  }, [authUser, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 justify-center items-center"
    >
      <h2 className="text-2xl">Login</h2>
      <input
        className="input"
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        className="input"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button
        type="submit"
        disabled={isLoggingIn}
        className="btn btn-primary rounded-full font-bold"
      >
        {isLoggingIn ? "Logging in..." : "Submit"}
      </button>
    </form>
  );
};

export default LoginForm;

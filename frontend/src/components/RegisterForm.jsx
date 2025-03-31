import React, { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navivate = useNavigate();
  const { authUser, register, isRegistering } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "job_seeker",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  useEffect(() => {
    if (authUser) navivate("/dashboard");
  }, [authUser, navivate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 justify-center items-center"
    >
      <h2 className="text-2xl">Register</h2>
      <input
        className="input"
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
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
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="role"
            value="job_seeker"
            checked={formData.role === "job_seeker"}
            onChange={handleChange}
          />
          Job Seeker
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="employer"
            checked={formData.role === "employer"}
            onChange={handleChange}
          />
          Employer
        </label>
      </div>
      <button
        type="submit"
        disabled={isRegistering}
        className="btn btn-primary rounded-full font-bold"
      >
        {isRegistering ? "Registering..." : "Submit"}
      </button>
    </form>
  );
};

export default RegisterForm;

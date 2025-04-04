import React, { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);

  if (authUser) return <Navigate to="/dashboard" replace />;

  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2 justify-center items-center">
      <div className="hidden md:flex flex-col justify-center items-center gap-4 bg-primary h-full text-white p-8">
        <h1 className="text-4xl font-bold">
          {isRegistering ? "Join Us Today!" : "Welcome Back!"}
        </h1>
        <p>
          {isRegistering
            ? "Create an account to start your journey."
            : "Sign in to access your account and apply for jobs."}
        </p>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 bg-base-300 h-full p-8">
        {isRegistering ? <RegisterForm /> : <LoginForm />}
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="btn btn-link text-secondary"
        >
          {isRegistering
            ? "Already have an account? Log in"
            : "New here? Register"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;

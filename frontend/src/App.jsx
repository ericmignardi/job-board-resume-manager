import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import JobListingsPage from "./pages/JobListingsPage.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import EmployerJobListingsPage from "./pages/EmployerJobListingsPage.jsx";
import EmployerApplicationsPage from "./pages/EmployerApplicationsPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";
import EmployerApplicationDetailsPage from "./pages/EmployerApplicationDetailsPage.jsx";
import EmployerJobDetailsPage from "./pages/EmployerJobDetailsPage.jsx";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, isVerifyingAuth, verify } = useAuthStore();

  useEffect(() => {
    verify();
  }, [verify]);

  if (isVerifyingAuth && !authUser) return <div className="loading"></div>;

  return (
    <>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<HomePage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />{" "}
          <Route path="overview" element={<OverviewPage />} />
          <Route path="jobs" element={<JobListingsPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          {/* EMPLOYER DASHBOARD */}
          <Route
            path="employer/jobs"
            element={
              authUser && authUser.role === "employer" ? (
                <EmployerJobListingsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="employer/jobs/:jobId"
            element={
              authUser && authUser.role === "employer" ? (
                <EmployerJobDetailsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="employer/applications"
            element={
              authUser && authUser.role === "employer" ? (
                <EmployerApplicationsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="employer/applications/:applicationId"
            element={
              authUser && authUser.role === "employer" ? (
                <EmployerApplicationDetailsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>

        {/* OTHER */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;

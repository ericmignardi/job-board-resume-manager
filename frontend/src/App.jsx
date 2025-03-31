import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import JobListingsPage from "./pages/JobListingsPage.jsx";
import JobDetailsPage from "./pages/JobDetailsPage.jsx";
import EmployerJobsPage from "./pages/EmployerJobsPage.jsx";
import EmployerApplicationsPage from "./pages/EmployerApplicationsPage.jsx";
import ApplicationsPage from "./pages/ApplicationsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";

const App = () => {
  const { authUser, isVerifyingAuth, verify } = useAuthStore();

  useEffect(() => {
    verify();
  }, [verify]);

  if (isVerifyingAuth && !authUser) return <div className="loading"></div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />{" "}
          <Route path="overview" element={<OverviewPage />} />
          <Route path="jobs" element={<JobListingsPage />} />
          <Route path="jobs/:id" element={<JobDetailsPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="employer/jobs"
            element={
              authUser && authUser.role === "employer" ? (
                <EmployerJobsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="employer/applications/:id"
            element={
              authUser && authUser.role === "employer" ? (
                <EmployerApplicationsPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;

import React, { useEffect } from "react";
import { useApplicationStore } from "../stores/useApplicationStore.js";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const EmployeeApplicationsPage = () => {
  const { applications, read, isReadingApplications } = useApplicationStore();

  useEffect(() => {
    read();
  }, [read]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Applications</h1>
      {isReadingApplications ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applicant</th>
                <th>Resume URL</th>
                <th>Cover Letter URL</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.job_title}</td>
                  <td>{application.user_name}</td>
                  <td>{application.resume_url}</td>
                  <td>{application.cover_letter}</td>
                  <td>{application.status.toUpperCase()}</td>
                  <td>
                    {new Date(application.applied_at).toLocaleDateString()}
                  </td>
                  <td>
                    <Link
                      to={`/dashboard/employer/applications/${application.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <FaEdit />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeApplicationsPage;

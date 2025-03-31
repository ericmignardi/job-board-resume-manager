import React, { useEffect } from "react";
import { useApplicationStore } from "../stores/useApplicationStore.js";

const ApplicationsPage = () => {
  const { applications, read, isReadingApplications } = useApplicationStore();

  useEffect(() => {
    read();
  }, [read]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      {isReadingApplications ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Job ID</th>
                <th>User ID</th>
                <th>Resume URL</th>
                <th>Cover Letter URL</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.job_id}</td>
                  <td>{application.user_id}</td>
                  <td>{application.resume_url}</td>
                  <td>{application.cover_letter}</td>
                  <td>{application.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;

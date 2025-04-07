import React, { useEffect, useState } from "react";
import { useApplicationStore } from "../stores/useApplicationStore.js";
import { useParams } from "react-router-dom";

const EmployerApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const {
    readByApplicationId,
    isReadingApplicationById,
    updateById,
    isUpdatingApplication,
  } = useApplicationStore();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      const applicationData = await readByApplicationId(applicationId);
      setApplication(applicationData);
      setStatus(applicationData.status);
    };
    fetchApplication();
  }, [applicationId, readByApplicationId]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!status) {
      return;
    }
    await updateById(applicationId, { status });
  };

  if (isReadingApplicationById) {
    return <p>Loading application details...</p>;
  }

  if (!application) {
    return <p>Application not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Application Details</h1>
      <p>
        <strong>Application ID:</strong> {application.id}
      </p>
      <p>
        <strong>Job ID:</strong> {application.job_id}
      </p>
      <p>
        <strong>User ID:</strong> {application.user_id}
      </p>
      <p>
        <strong>Resume URL:</strong>{" "}
        <a
          href={application.resume_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {application.resume_url}
        </a>
      </p>
      <p>
        <strong>Cover Letter URL:</strong>{" "}
        <a
          href={application.cover_letter}
          target="_blank"
          rel="noopener noreferrer"
        >
          {application.cover_letter}
        </a>
      </p>
      <p>
        <strong>Status:</strong> {application.status}
      </p>
      <p>
        <strong>Applied on:</strong>{" "}
        {new Date(application.applied_at).toLocaleDateString()}
      </p>
      <form onSubmit={handleStatusUpdate}>
        <div className="mt-4">
          <label htmlFor="status" className="block text-lg font-medium">
            Update Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={isUpdatingApplication}
        >
          {isUpdatingApplication ? "Updating..." : "Update Status"}
        </button>
      </form>
    </div>
  );
};

export default EmployerApplicationDetailsPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore.js";

const JobDetailsPage = () => {
  const { id } = useParams(); // Get job ID from URL
  const { readById, isReadingJobById } = useJobStore();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await readById(id);
      setJob(jobData);
    };

    fetchJob();
  }, [id, readById]);

  if (isReadingJobById) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{job.title}</h1>
      <p className="text-gray-600">{job.company_name}</p>
      <p className="mt-2">
        <strong>Location:</strong> {job.location}
      </p>
      <p>
        <strong>Employment Type:</strong> {job.employment_type.toUpperCase()}
      </p>
      <p>
        <strong>Salary:</strong> ${job.salary}
      </p>
      <p className="mt-4">{job.description}</p>
    </div>
  );
};

export default JobDetailsPage;

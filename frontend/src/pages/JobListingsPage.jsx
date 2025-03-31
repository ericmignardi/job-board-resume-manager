import React, { useEffect } from "react";
import { useJobStore } from "../stores/useJobStore.js";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const JobListingsPage = () => {
  const { jobs, read, isReadingJobs } = useJobStore();

  useEffect(() => {
    read();
  }, [read]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Job Listings</h1>
      {isReadingJobs ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary ($)</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="font-semibold">{job.title}</td>
                  <td>{job.description}</td>
                  <td>{job.company_name}</td>
                  <td>{job.location}</td>
                  <td>{job.employment_type.toUpperCase()}</td>
                  <td>{job.salary}</td>
                  <td>
                    <Link
                      to={`/dashboard/jobs/${job.id}`}
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

export default JobListingsPage;

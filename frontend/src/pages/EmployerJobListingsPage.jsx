import React, { useEffect, useState } from "react";
import { useJobStore } from "../stores/useJobStore.js";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const EmployerJobsPage = () => {
  const {
    jobs,
    read,
    create,
    deleteById,
    isReadingJobs,
    isCreatingJob,
    isDeletingJob,
  } = useJobStore();
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_name: "",
    location: "",
    employment_type: "",
    salary: "",
  });

  useEffect(() => {
    read();
  }, [read]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await create(formData);
      setFormOpen(false);
      setFormData({
        title: "",
        description: "",
        company_name: "",
        location: "",
        employment_type: "",
        salary: "",
      });
      read(); // Refresh jobs
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteById(jobId);
      read(); // Refresh job list
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Job Listings</h1>

      {/* Toggle Create Job Form */}
      <button
        onClick={() => setOpenForm(!openForm)}
        className="btn btn-success mb-4"
      >
        {openForm ? "Cancel" : "Create New Job"}
      </button>

      {openForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded-md bg-base-300 mb-6"
        >
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="input input-bordered w-full mb-2"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="textarea textarea-bordered w-full mb-2"
            required
          />
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="input input-bordered w-full mb-2"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input input-bordered w-full mb-2"
            required
          />
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="select select-bordered w-full mb-2"
            required
          >
            <option value="" disabled>
              Select Employment Type
            </option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Salary (optional)"
            className="input input-bordered w-full mb-4"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isCreatingJob}
          >
            {isCreatingJob ? "Creating..." : "Create Job"}
          </button>
        </form>
      )}

      {/* Job Listings Table */}
      {isReadingJobs ? (
        <p>Loading your jobs...</p>
      ) : jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
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
                <th>Edit</th>
                <th>Delete</th>
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
                      to={`/dashboard/employer/jobs/${job.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      <FaEdit />
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="btn btn-error btn-sm"
                      disabled={isDeletingJob}
                    >
                      <FaTrash />
                    </button>
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

export default EmployerJobsPage;

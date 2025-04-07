import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore.js";

const EmployerJobDetailsPage = () => {
  const { jobId } = useParams(); // Get job ID from URL
  const { readById, updateById, isReadingJobById, isUpdatingJobById } =
    useJobStore();
  const [job, setJob] = useState(null);
  const [openForm, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company_name: "",
    location: "",
    employment_type: "",
    salary: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await readById(jobId);
      setJob(jobData);
      setFormData({
        title: jobData?.title || "",
        description: jobData?.description || "",
        company_name: jobData?.company_name || "",
        location: jobData?.location || "",
        employment_type: jobData?.employment_type || "",
        salary: jobData?.salary || "",
      });
    };

    fetchJob();
  }, [jobId, readById]);

  if (isReadingJobById) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

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
      await updateById(jobId, formData);
      alert("Job updated successfully!");
      setFormOpen(false);
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center items-center gap-4">
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

      <button
        onClick={() => setFormOpen(!openForm)}
        className="btn btn-primary rounded-full"
      >
        {openForm ? "Cancel" : "Edit Job"}
      </button>

      {openForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 flex flex-col justify-center items-center gap-4"
        >
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="input input-bordered w-full max-w-md"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            className="textarea textarea-bordered w-full max-w-md"
            required
          />
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="input input-bordered w-full max-w-md"
            required
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input input-bordered w-full max-w-md"
            required
          />
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="select select-bordered w-full max-w-md"
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
            className="input input-bordered w-full max-w-md"
          />
          <button
            type="submit"
            className="btn btn-success rounded-full"
            disabled={isUpdatingJobById}
          >
            {isUpdatingJobById ? "Updating..." : "Update Job"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EmployerJobDetailsPage;

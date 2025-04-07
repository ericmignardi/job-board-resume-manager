import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useJobStore } from "../stores/useJobStore.js";
import { useApplicationStore } from "../stores/useApplicationStore.js";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { readById, isReadingJobById } = useJobStore();
  const { create, isCreatingApplication } = useApplicationStore();
  const [job, setJob] = useState(null);
  const [openForm, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    job_id: "",
    user_id: "",
    resume_url: null,
    cover_letter: null,
    status: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await readById(jobId);
      setJob(jobData);
    };

    fetchJob();
  }, [jobId, readById]);

  if (isReadingJobById) {
    return <p>Loading job details...</p>;
  }

  if (!job) {
    return <p>Job not found.</p>;
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume || !formData.cover_letter) {
      alert("Resume and Cover Letter are required!");
      return;
    }
    const applicationData = new FormData();
    applicationData.append("resume", formData.resume);
    applicationData.append("cover_letter", formData.cover_letter);
    try {
      await create(jobId, applicationData);
    } catch (error) {
      console.error("Error submitting application:", error);
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
        {openForm ? "Cancel" : "Apply Now"}
      </button>
      {openForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 flex flex-col justify-center items-center gap-4"
        >
          <div className="flex gap-4">
            <label htmlFor="resume">
              <input
                className="file-input"
                type="file"
                name="resume"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
            </label>
            <label htmlFor="cover_letter">
              <input
                className="file-input"
                type="file"
                name="cover_letter"
                id="cover_letter"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-success rounded-full"
            disabled={isCreatingApplication}
          >
            {isCreatingApplication ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default JobDetailsPage;

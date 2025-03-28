import { sql } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

export const create = async (req, res) => {
  const { job_id, status } = req.body;
  const { id: userId } = req.user;
  const { resume, cover_letter } = req.files;
  try {
    if (!job_id || !resume || !cover_letter)
      return res.status(400).json({ message: "All Fields Required" });

    // Upload Resume to Cloudinary
    const resumeUploadResult = await cloudinary.uploader.upload(resume.path, {
      folder: "resumes", // Optional: specify folder in Cloudinary
      resource_type: "auto", // Automatically detect file type (image, pdf, etc.)
    });

    // Upload Cover Letter to Cloudinary
    const coverLetterUploadResult = await cloudinary.uploader.upload(
      cover_letter.path,
      {
        folder: "cover_letters", // Optional: specify folder in Cloudinary
        resource_type: "auto", // Automatically detect file type
      }
    );

    const applicationStatus = status || "pending";
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(applicationStatus)) {
      return res.status(400).json({ message: "Invalid Status" });
    }
    const application = await sql`
    INSERT INTO applications (job_id, user_id, resume_url, cover_letter_url, status) 
    VALUES (${job_id}, ${userId}, ${resumeUploadResult.secure_url}, ${coverLetterUploadResult.secure_url}, ${applicationStatus}) 
    RETURNING *;`;
    console.log("Successfully Created Application");
    res.status(201).json(application[0]);
  } catch (error) {
    console.error("Error in create:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const read = async (req, res) => {
  const { id: userId } = req.user;
  try {
    const applications = await sql`
    SELECT * FROM applications WHERE user_id = ${userId};`;
    console.log("Successfully Read Applications");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in read:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readById = async (req, res) => {
  const { id: employerId } = req.user;
  const { id: jobId } = req.params;
  try {
    // Ensure employer owns the job posting before fetching applications
    const jobs = await sql`
    SELECT * FROM jobs WHERE id = ${jobId} AND posted_by = ${employerId};`;
    if (jobs.length === 0)
      return res
        .status(403)
        .json({ message: "Unauthorized: Must Be Original Publisher" });
    const applications = await sql`
    SELECT * FROM applications WHERE job_id = ${jobId};`;
    console.log("Successfully Read Applications");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in readById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateById = async (req, res) => {
  const { id: employerId } = req.user;
  const { id: applicationId } = req.params;
  const { status } = req.body;
  try {
    if (!status)
      return res.status(400).json({ message: "Status field is required" });
    // Verify employer owns the job posting before updating an application
    const jobsApplications = await sql`
    SELECT jobs.id FROM jobs 
    JOIN applications ON jobs.id = applications.job_id
    WHERE applications.id = ${applicationId} AND jobs.posted_by = ${employerId};`;
    if (jobsApplications.length === 0)
      return res
        .status(403)
        .json({ message: "Unauthorized: Must Be Original Publisher" });
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid Status" });
    }
    const updatedApplication = await sql`
    UPDATE applications SET status = ${status} WHERE id = ${applicationId} RETURNING *;`;
    console.log("Successfully Updated Application");
    res.status(200).json(updatedApplication[0]);
  } catch (error) {
    console.error("Error in updateById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

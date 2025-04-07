import { sql } from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

export const create = async (req, res) => {
  const { id: userId } = req.user;
  const { jobId } = req.params;
  if (!req.files || !req.files.resume || !req.files.cover_letter) {
    return res
      .status(400)
      .json({ message: "Resume and Cover Letter Required" });
  }
  const { resume, cover_letter } = req.files;
  try {
    const resumeUploadResult = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: "resumes",
        resource_type: "auto",
      }
    );
    const coverLetterUploadResult = await cloudinary.uploader.upload(
      cover_letter.tempFilePath,
      {
        folder: "cover_letters",
        resource_type: "auto",
      }
    );
    const application = await sql`
      INSERT INTO applications (job_id, user_id, resume_url, cover_letter, status) 
      VALUES (${jobId}, ${userId}, ${resumeUploadResult.secure_url}, ${coverLetterUploadResult.secure_url}, 'pending')
      RETURNING *;`;
    res.status(201).json(application[0]);
  } catch (error) {
    console.error("Error in create:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const read = async (req, res) => {
  const { id: userId, role } = req.user;
  try {
    let applications;
    if (role === "employer") {
      applications = await sql`
      SELECT applications.*, jobs.title AS job_title
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE jobs.posted_by = ${userId};`;
    } else {
      applications = await sql`
      SELECT applications.*, jobs.title AS job_title
      FROM applications
      JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.user_id = ${userId};`;
    }
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in read:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readById = async (req, res) => {
  const { id: userId, role } = req.user;
  const { jobId } = req.params;
  try {
    let applications;
    if (role === "employer") {
      const jobs = await sql`
      SELECT * FROM jobs WHERE id = ${jobId} AND posted_by = ${userId};`;
      if (jobs.length === 0) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Must Be Original Publisher" });
      }
      applications = await sql`
        SELECT applications.*, users.name AS applicant_name, users.email AS applicant_email
        FROM applications
        JOIN users ON applications.user_id = users.id
        WHERE applications.job_id = ${jobId};`;
    } else {
      applications = await sql`
        SELECT * FROM applications WHERE job_id = ${jobId} AND user_id = ${userId};`;
      if (applications.length === 0) {
        return res.status(404).json({ message: "Application not found" });
      }
    }
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error in readById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readByApplicationId = async (req, res) => {
  const { id: userId, role } = req.user;
  const { applicationId } = req.params;
  try {
    let application;
    if (role === "employer") {
      const jobsApplications = await sql`
        SELECT jobs.id FROM jobs 
        JOIN applications ON jobs.id = applications.job_id
        WHERE applications.id = ${applicationId} AND jobs.posted_by = ${userId};
      `;
      if (jobsApplications.length === 0) {
        return res
          .status(403)
          .json({ message: "Unauthorized: Must Be Original Publisher" });
      }
      application = await sql`
        SELECT applications.*, users.name AS applicant_name, users.email AS applicant_email
        FROM applications
        JOIN users ON applications.user_id = users.id
        WHERE applications.id = ${applicationId};
      `;
    } else {
      application = await sql`
        SELECT * FROM applications WHERE id = ${applicationId} AND user_id = ${userId};
      `;
      if (application.length === 0) {
        return res.status(404).json({ message: "Application not found" });
      }
    }
    res.status(200).json(application[0]);
  } catch (error) {
    console.error("Error in readByApplicationId:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateById = async (req, res) => {
  const { id: employerId } = req.user;
  const { id: applicationId } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Status field is required" });
  }
  try {
    const applicationExists = await sql`
      SELECT * FROM applications WHERE id = ${applicationId};
    `;
    if (applicationExists.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }
    const jobsApplications = await sql`
      SELECT jobs.id FROM jobs 
      JOIN applications ON jobs.id = applications.job_id
      WHERE applications.id = ${applicationId} AND jobs.posted_by = ${employerId};
    `;
    if (jobsApplications.length === 0) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Must Be Original Publisher" });
    }
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid Status" });
    }
    const updatedApplication = await sql`
      UPDATE applications SET status = ${status} WHERE id = ${applicationId} RETURNING *;
    `;
    res.status(200).json(updatedApplication[0]);
  } catch (error) {
    console.error("Error in updateById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

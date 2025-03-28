import { sql } from "../config/db.js";

export const create = async (req, res) => {
  const {
    title,
    description,
    company_name,
    location,
    employment_type,
    salary,
  } = req.body;
  const { id: userId } = req.user;
  const { role } = req.user;
  try {
    if (
      !title ||
      !description ||
      !company_name ||
      !location ||
      !employment_type
    )
      return res.status(400).json({ message: "All Fields Required" });
    if (role !== "employer")
      return res.status(403).json({ message: "Forbidden: Must Be Employer" });
    const job = await sql`
    INSERT INTO jobs (title, description, company_name, location, employment_type, salary, posted_by)
    VALUES (${title}, ${description}, ${company_name}, ${location}, ${employment_type}, COALESCE(${salary}, NULL), ${userId})
    RETURNING *;`;
    if (job.length === 0)
      return res.status(400).json({ message: "Error Creating Job" });
    console.log("Successfully Created Job");
    res.status(201).json(job[0]);
  } catch (error) {
    console.log("Error in create: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const read = async (req, res) => {
  try {
    const jobs = await sql`
    SELECT * FROM jobs;`;
    if (jobs.length === 0)
      return res.status(404).json({ message: "No Jobs Found" });
    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in read: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readById = async (req, res) => {
  const { id: jobId } = req.params;
  try {
    const job = await sql`
    SELECT * FROM jobs WHERE id = ${jobId};`;
    if (job.length === 0)
      return res.status(404).json({ message: "Job Not Found" });
    res.status(200).json(job[0]);
  } catch (error) {
    console.log("Error in readById: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateById = async (req, res) => {
  const {
    title,
    description,
    company_name,
    location,
    employment_type,
    salary,
  } = req.body;
  const { id: userId } = req.user;
  const { role } = req.user;
  const { id: jobId } = req.params;
  try {
    if (
      !title ||
      !description ||
      !company_name ||
      !location ||
      !employment_type
    )
      return res.status(400).json({ message: "All Fields Required" });
    if (role !== "employer")
      return res.status(403).json({ message: "Forbidden: Must Be Employer" });
    const job = await sql`
    SELECT * FROM jobs WHERE id = ${jobId};`;
    if (job.length === 0)
      return res.status(404).json({ message: "Job Not Found" });
    if (job[0].posted_by !== userId)
      return res
        .status(403)
        .json({ message: "Forbidden: Must Be Original Publisher" });
    const updatedJob = await sql`
    UPDATE jobs
    SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        company_name = COALESCE(${company_name}, company_name),
        location = COALESCE(${location}, location),
        employment_type = COALESCE(${employment_type}, employment_type),
        salary = COALESCE(${salary}, salary)
    WHERE id = ${jobId} 
    RETURNING *;`;
    if (updatedJob.length === 0)
      return res.status(400).json({ message: "Error Updating Job" });
    console.log("Successfully Updated Job");
    res.status(200).json(updatedJob[0]);
  } catch (error) {
    console.log("Error in updateById: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteById = async (req, res) => {
  const { id: userId } = req.user;
  const { role } = req.user;
  const { id: jobId } = req.params;
  try {
    if (role !== "employer")
      return res.status(403).json({ message: "Forbidden: Must Be Employer" });
    const job = await sql`
    SELECT * FROM jobs WHERE id = ${jobId};`;
    if (job.length === 0)
      return res.status(404).json({ message: "Job Not Found" });
    if (job[0].posted_by !== userId)
      return res
        .status(403)
        .json({ message: "Forbidden: Must Be Original Publisher" });
    await sql`
    DELETE FROM jobs WHERE id = ${jobId};`;
    console.log("Successfully Deleted Job");
    res.status(200).json({ message: "Successfully Deleted Job" });
  } catch (error) {
    console.log("Error in deleteById: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

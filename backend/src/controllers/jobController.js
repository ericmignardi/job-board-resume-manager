import { sql } from "../config/db.js";

// Create a job (Only Employers)
export const create = async (req, res) => {
  const {
    title,
    description,
    company_name,
    location,
    employment_type,
    salary,
  } = req.body;
  const { id: userId, role } = req.user;

  try {
    if (
      !title ||
      !description ||
      !company_name ||
      !location ||
      !employment_type
    ) {
      return res.status(400).json({ message: "All Fields Required" });
    }
    if (role !== "employer") {
      return res.status(403).json({ message: "Forbidden: Must Be Employer" });
    }

    const job = await sql`
      INSERT INTO jobs (title, description, company_name, location, employment_type, salary, posted_by)
      VALUES (${title}, ${description}, ${company_name}, ${location}, ${employment_type}, COALESCE(${salary}, NULL), ${userId})
      RETURNING *;
    `;

    res.status(201).json(job[0]);
  } catch (error) {
    console.error("Error in create:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Read all jobs (Only jobs posted by the logged-in employer)
export const read = async (req, res) => {
  const { id: userId, role } = req.user;

  try {
    let jobs;
    if (role === "employer") {
      jobs = await sql`
      SELECT * FROM jobs WHERE posted_by = ${userId};
    `;
    } else {
      jobs = await sql`
      SELECT * FROM jobs;
    `;
    }

    if (jobs.length === 0) {
      return res.status(404).json({ message: "No Jobs Found" });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in read:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Read a single job by ID (Employers can only see their own, Job seekers can view all)
export const readById = async (req, res) => {
  const { id: jobId } = req.params;
  const { id: userId, role } = req.user;

  try {
    let job;

    if (role === "employer") {
      job = await sql`
        SELECT * FROM jobs WHERE id = ${jobId} AND posted_by = ${userId};
      `;
    } else {
      job = await sql`
        SELECT * FROM jobs WHERE id = ${jobId};
      `; // Job seekers can view all jobs
    }

    if (job.length === 0) {
      return res.status(404).json({ message: "Job Not Found or Unauthorized" });
    }

    res.status(200).json(job[0]);
  } catch (error) {
    console.error("Error in readById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a job (Only the employer who posted it)
export const updateById = async (req, res) => {
  const {
    title,
    description,
    company_name,
    location,
    employment_type,
    salary,
  } = req.body;
  const { id: jobId } = req.params;
  const { id: userId, role } = req.user;

  try {
    if (role !== "employer") {
      return res.status(403).json({ message: "Forbidden: Must Be Employer" });
    }

    const job = await sql`
      SELECT * FROM jobs WHERE id = ${jobId} AND posted_by = ${userId};
    `;

    if (job.length === 0) {
      return res.status(404).json({ message: "Job Not Found or Unauthorized" });
    }

    const updatedJob = await sql`
      UPDATE jobs
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        company_name = COALESCE(${company_name}, company_name),
        location = COALESCE(${location}, location),
        employment_type = COALESCE(${employment_type}, employment_type),
        salary = COALESCE(${salary}, salary)
      WHERE id = ${jobId} AND posted_by = ${userId}
      RETURNING *;
    `;

    res.status(200).json(updatedJob[0]);
  } catch (error) {
    console.error("Error in updateById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a job (Only the employer who posted it)
export const deleteById = async (req, res) => {
  const { id: jobId } = req.params;
  const { id: userId, role } = req.user;

  try {
    if (role !== "employer") {
      return res.status(403).json({ message: "Forbidden: Must Be Employer" });
    }

    const job = await sql`
      SELECT * FROM jobs WHERE id = ${jobId} AND posted_by = ${userId};
    `;

    if (job.length === 0) {
      return res.status(404).json({ message: "Job Not Found or Unauthorized" });
    }

    await sql`
      DELETE FROM jobs WHERE id = ${jobId} AND posted_by = ${userId};
    `;

    res.status(200).json({ message: "Successfully Deleted Job" });
  } catch (error) {
    console.error("Error in deleteById:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useJobStore = create((set, get) => ({
  jobs: [],
  isJobsLoading: false,
  isCreatingJob: false,
  isReadingJobs: false,
  isReadingJobById: false,
  isUpdatingJob: false,
  isDeletingJob: false,
  create: async (formData) => {
    set({ isCreatingJob: true });
    try {
      const response = await axiosInstance.post("/jobs", formData);
      set((state) => ({ jobs: [...state.jobs, response.data] })); // Append new job
    } catch (error) {
      console.log("Error in create:", error.message);
    } finally {
      set({ isCreatingJob: false });
    }
  },
  read: async () => {
    set({ isReadingJobs: true });
    try {
      const response = await axiosInstance.get("/jobs");
      set({ jobs: response.data });
    } catch (error) {
      console.log("Error in read:", error.message);
    } finally {
      set({ isReadingJobs: false });
    }
  },
  readById: async (id) => {
    set({ isReadingJobById: true });
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      return response.data; // Don't store it in `jobs`, just return the single job
    } catch (error) {
      console.log("Error in readById:", error.message);
    } finally {
      set({ isReadingJobById: false });
    }
  },
  updateById: async (id, formData) => {
    set({ isUpdatingJob: true });
    try {
      const response = await axiosInstance.put(`/jobs/${id}`, formData);
      set((state) => ({
        jobs: state.jobs.map(
          (job) => (job.id === id ? response.data : job) // Update the specific job
        ),
      }));
    } catch (error) {
      console.log("Error in updateById:", error.message);
    } finally {
      set({ isUpdatingJob: false });
    }
  },
  deleteById: async (id) => {
    set({ isDeletingJob: true });
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id), // Remove deleted job
      }));
    } catch (error) {
      console.log("Error in deleteById:", error.message);
    } finally {
      set({ isDeletingJob: false });
    }
  },
}));

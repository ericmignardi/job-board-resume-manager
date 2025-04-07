import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

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
      set((state) => ({ jobs: [...state.jobs, response.data] }));
      toast.success("Successfully Created Job");
    } catch (error) {
      console.log("Error in create:", error.message);
      toast.error("Error Creating Job");
    } finally {
      set({ isCreatingJob: false });
    }
  },
  read: async () => {
    set({ isReadingJobs: true });
    try {
      const response = await axiosInstance.get("/jobs");
      set({ jobs: response.data });
      toast.success("Successfully Read Jobs");
    } catch (error) {
      console.log("Error in read:", error.message);
      toast.error("Error Reading Jobs");
    } finally {
      set({ isReadingJobs: false });
    }
  },
  readById: async (id) => {
    set({ isReadingJobById: true });
    try {
      const response = await axiosInstance.get(`/jobs/${id}`);
      toast.success("Successfully Read Job");
      return response.data;
    } catch (error) {
      console.log("Error in readById:", error.message);
      toast.error("Error Reading Job");
    } finally {
      set({ isReadingJobById: false });
    }
  },
  updateById: async (id, formData) => {
    set({ isUpdatingJob: true });
    try {
      const response = await axiosInstance.put(`/jobs/${id}`, formData);
      set((state) => ({
        jobs: state.jobs.map((job) => (job.id === id ? response.data : job)),
      }));
      toast.success("Successfully Updated Job");
    } catch (error) {
      console.log("Error in updateById:", error.message);
      toast.error("Error Updating Job");
    } finally {
      set({ isUpdatingJob: false });
    }
  },
  deleteById: async (id) => {
    set({ isDeletingJob: true });
    try {
      await axiosInstance.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job.id !== id),
      }));
      toast.success("Successfully Deleted Job");
    } catch (error) {
      console.log("Error in deleteById:", error.message);
      toast.error("Error Deleting Job");
    } finally {
      set({ isDeletingJob: false });
    }
  },
}));

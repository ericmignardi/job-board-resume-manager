import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useApplicationStore = create((set) => ({
  applications: [],
  selectedApplication: null,
  isApplicationsLoading: false,
  isCreatingApplication: false,
  isReadingApplications: false,
  isReadingApplicationById: false,
  isUpdatingApplication: false,
  create: async (formData) => {
    set({ isCreatingApplication: true });
    try {
      const response = await axiosInstance.post("/applications", formData);
      set((state) => ({
        applications: [...state.applications, response.data], // Append new application
      }));
    } catch (error) {
      console.log("Error in create: ", error.message);
    } finally {
      set({ isCreatingApplication: false });
    }
  },
  read: async () => {
    set({ isReadingApplications: true });
    try {
      const response = await axiosInstance.get("/applications");
      set({ applications: response.data });
    } catch (error) {
      console.log("Error in read: ", error.message);
    } finally {
      set({ isReadingApplications: false });
    }
  },
  readById: async (id) => {
    set({ isReadingApplicationById: true });
    try {
      const response = await axiosInstance.get(`/applications/${id}`);
      set({ selectedApplication: response.data }); // Store in state
      return response.data; // Also return it for immediate use
    } catch (error) {
      console.log("Error in readById: ", error.message);
    } finally {
      set({ isReadingApplicationById: false });
    }
  },
  updateById: async (id, formData) => {
    set({ isUpdatingApplication: true });
    try {
      const response = await axiosInstance.put(`/applications/${id}`, formData);
      set((state) => ({
        applications: state.applications.map((application) =>
          application.id === id ? response.data : application
        ),
      }));
    } catch (error) {
      console.log("Error in updateById: ", error.message);
    } finally {
      set({ isUpdatingApplication: false });
    }
  },
}));

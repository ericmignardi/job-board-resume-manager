import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useApplicationStore = create((set) => ({
  applications: [],
  isApplicationsLoading: false,
  isCreatingApplication: false,
  isReadingApplications: false,
  isReadingApplicationById: false,
  isUpdatingApplication: false,
  create: async (id, formData) => {
    set({ isCreatingApplication: true });
    try {
      const response = await axiosInstance.post(
        `/applications/${id}`,
        formData
      );
      set((state) => ({
        applications: [...state.applications, response.data],
      }));
      toast.success("Successfully Created Application");
    } catch (error) {
      console.log("Error in create: ", error.message);
      toast.error("Error Creating Application");
    } finally {
      set({ isCreatingApplication: false });
    }
  },
  read: async () => {
    set({ isReadingApplications: true });
    try {
      const response = await axiosInstance.get("/applications");
      set({ applications: response.data });
      toast.success("Successfully Read All Applications");
    } catch (error) {
      console.log("Error in read: ", error.message);
      toast.error("Error Reading Applications");
    } finally {
      set({ isReadingApplications: false });
    }
  },
  readById: async (id) => {
    set({ isReadingApplicationById: true });
    try {
      const response = await axiosInstance.get(`/applications/job/${id}`);
      toast.success(`Successfully Read Applications For Job ID: ${id}`);
      return response.data;
    } catch (error) {
      console.log("Error in readById: ", error.message);
      toast.error(`Error Reading Applications For Job ID: ${id}`);
    } finally {
      set({ isReadingApplicationById: false });
    }
  },
  readByApplicationId: async (id) => {
    set({ isReadingApplicationById: true });
    try {
      const response = await axiosInstance.get(
        `/applications/application/${id}`
      );
      toast.success(`Successfully Read Applications For Job ID: ${id}`);
      return response.data;
    } catch (error) {
      console.log("Error in readById: ", error.message);
      toast.error(`Error Reading Applications For Job ID: ${id}`);
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
      toast.success(`Successfully Updated Application ID: ${id}`);
    } catch (error) {
      console.log("Error in updateById: ", error.message);
      toast.error(`Error Updating Application ID: ${id}`);
    } finally {
      set({ isUpdatingApplication: false });
    }
  },
}));

import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isVerifyingAuth: true,
  isRegistering: false,
  isLoggingIn: false,
  verify: async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in verify: ", error.message);
      set({ authUser: null });
    } finally {
      set({ isVerifyingAuth: false });
    }
  },
  register: async (formData) => {
    set({ isRegistering: true });
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in register: ", error.message);
    } finally {
      set({ isRegistering: false });
    }
  },
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in login: ", error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.log("Error in logout: ", error.message);
    }
  },
}));

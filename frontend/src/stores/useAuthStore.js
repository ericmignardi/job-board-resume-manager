import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isVerifyingAuth: true,
  isRegistering: false,
  isLoggingIn: false,
  verify: async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      set({ authUser: response.data });
      toast.success("Successfully Verified User");
    } catch (error) {
      console.log("Error in verify: ", error.message);
      set({ authUser: null });
      toast.error("Error Verifying User");
    } finally {
      set({ isVerifyingAuth: false });
    }
  },
  register: async (formData) => {
    set({ isRegistering: true });
    try {
      const response = await axiosInstance.post("/auth/register", formData);
      set({ authUser: response.data });
      toast.success("Successfully Registered User");
    } catch (error) {
      console.log("Error in register: ", error.message);
      toast.error("Error Registering User");
    } finally {
      set({ isRegistering: false });
    }
  },
  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      set({ authUser: response.data });
      toast.success("Successfully Logged In");
    } catch (error) {
      console.log("Error in login: ", error.message);
      toast.error("Error Logging In");
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Successfully Logged Out");
    } catch (error) {
      console.log("Error in logout: ", error.message);
      toast.error("Error Logging Out");
    }
  },
}));

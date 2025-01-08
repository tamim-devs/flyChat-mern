import { create } from "zustand";
import { axiosInsance } from "../lib/axios";

export const useAuthStore = create((set)=>({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,


  checkAuth: async () => {
    try {
      const res = await axiosInsance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  }
}))

signup: async (data) =>{
  
}
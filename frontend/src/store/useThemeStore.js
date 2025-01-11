import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee", // Default theme is coffee
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);  // Save theme in localStorage
    set({ theme });  // Update the theme in store
  },
}));

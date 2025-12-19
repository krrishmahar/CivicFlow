
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeState = {
  theme: "light" | "dark";
};

const getInitialTheme = (): ThemeState["theme"] => {
  if (typeof window === "undefined") return "light";

  // Check localStorage first
  const savedTheme = localStorage.getItem("theme") as ThemeState["theme"] | null;
  if (savedTheme) {
    return savedTheme;
  }

  // Check current DOM state
  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  // Check system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }

  return "light";
};

// ✅ Apply theme to DOM and localStorage
const applyTheme = (theme: ThemeState["theme"]) => {
  if (typeof window === "undefined") return;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      applyTheme(state.theme);
    },
    setTheme: (state, action: PayloadAction<ThemeState["theme"]>) => {
      state.theme = action.payload;
      applyTheme(action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;



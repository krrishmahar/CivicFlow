"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setTheme } from "@/redux/themeSlice";

export function ThemeInitializer() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save to localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme && savedTheme !== theme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch, theme]);

  return null;
}





"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import TodoList from "@/components/todo-list";
import { LogOut, ListTodo, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function TodosPage() {
  // Get authentication state, logout function, and loading status from auth context
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  // Get theme state and setter from next-themes
  const { theme, setTheme } = useTheme();

  // Redirect to login page if user is not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Handle user logout and redirect to login page
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Show nothing while authentication is being checked
  if (isLoading || !user) {
    return null;
  }

  return (
    // Main container with full height and column layout
    <div className="min-h-screen flex flex-col">
      {/* Header section with logo and user controls */}
      <header className="header">
        <div className="container header-container">
          {/* App logo and title */}
          <div className="logo-container">
            <div className="icon-container">
              <ListTodo className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">TaskMaster</h1>
          </div>
          {/* User controls: theme toggle, username display, logout button */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="btn btn-icon"
              style={{
                backgroundColor: "#f3f4f6",
                color: "#4b5563",
                border: "none",
              }}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {/* Username display - hidden on mobile */}
            <span
              style={{
                color: "#6b7280",
                display: "none",
                "@media (min-width: 768px)": { display: "inline-block" },
              }}
            >
              Welcome,{" "}
              <span style={{ fontWeight: 500, color: "#111827" }}>
                {user.username}
              </span>
            </span>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content area with todo list */}
      <main style={{ flex: 1, padding: "3rem 0" }}>
        <div className="container">
          <TodoList />
        </div>
      </main>

      {/* Footer with copyright information */}
      <footer className="footer">
        <div className="container text-center">
          <p style={{ color: "#6b7280" }}>
            &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

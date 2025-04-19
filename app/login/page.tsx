"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import LoginForm from "@/components/login-form";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  // Get the authenticated user from auth context
  const { user } = useAuth();
  const router = useRouter();
  // Get URL query parameters to check if user just registered
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  // Redirect to todos page if user is already logged in
  useEffect(() => {
    if (user) {
      router.push("/todos");
    }
  }, [user, router]);

  return (
    // Main container with full height and centered content
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      {/* Back button to return to home page */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          color: "#3b82f6",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        Back to Home
      </Link>

      {/* Login form container with width constraints */}
      <div style={{ width: "100%", maxWidth: "28rem", marginBottom: "2rem" }}>
        {/* App title and tagline */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            className="text-gradient"
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            TaskMaster
          </h1>
          <p style={{ color: "#6b7280" }}>Manage your tasks efficiently</p>
        </div>

        {/* Success message shown only after registration */}
        {registered && (
          <div className="alert alert-success" style={{ marginBottom: "2rem" }}>
            <CheckCircle className="h-5 w-5" />
            <p>Registration successful! Please login with your credentials.</p>
          </div>
        )}

        {/* Import and render the login form component */}
        <LoginForm />
      </div>
    </div>
  );
}

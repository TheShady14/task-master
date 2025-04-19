"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import RegisterForm from "@/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  // Access the authenticated user from auth context
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to todos page if user is already authenticated
  useEffect(() => {
    if (user) {
      router.push("/todos");
    }
  }, [user, router]);

  return (
    // Main container with full viewport height and centered content
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
      {/* Back navigation button positioned at top-left */}
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

      {/* Registration form container with width constraints */}
      <div style={{ width: "100%", maxWidth: "28rem", marginBottom: "2rem" }}>
        {/* App title and registration tagline */}
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
          <p style={{ color: "#6b7280" }}>Create your account to get started</p>
        </div>

        {/* Import and render the registration form component */}
        <RegisterForm />
      </div>
    </div>
  );
}

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, User, Mail, Lock } from "lucide-react";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate email ends with @gmail.com
    if (!email.endsWith("@gmail.com")) {
      setError("Email must end with @gmail.com");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login page on successful registration
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: "28rem", margin: "0 auto" }}>
      <div className="card-header text-center">
        <div
          className="icon-container"
          style={{
            margin: "0 auto",
            marginBottom: "1rem",
            width: "4rem",
            height: "4rem",
          }}
        >
          <User className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Sign up to start managing your tasks
        </p>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User className="input-icon" />
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              Email must end with @gmail.com
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>

      <div className="card-footer text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <button
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            onClick={() => router.push("/login")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

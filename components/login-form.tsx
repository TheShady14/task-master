"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { AlertCircle, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.token, data.user);
      router.push("/todos");
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
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Enter your credentials to access your tasks
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

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <div className="card-footer text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            onClick={() => router.push("/register")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}

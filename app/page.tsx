import Link from "next/link";
import { ListTodo, Shield, Zap, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="header">
        <div className="container header-container">
          <div className="logo-container">
            <div className="icon-container">
              <ListTodo className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">TaskMaster</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <button className="btn btn-outline">Login</button>
            </Link>
            <Link href="/register">
              <button className="btn btn-primary">Register</button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <h2 className="hero-title">Manage Your Tasks Efficiently</h2>
            <p className="hero-subtitle">
              A simple, secure, and feature-rich todo application to help you
              stay organized and boost your productivity.
            </p>
            <div className="flex-center">
              <Link href="/register">
                <button
                  className="btn"
                  style={{ background: "white", color: "#3b82f6" }}
                >
                  Get Started
                </button>
              </Link>
              <Link href="/login">
                <button
                  className="btn"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                >
                  Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="features-title">Features</h2>
            <div className="features-grid">
              {/* Feature 1 */}
              <div className="card feature-card">
                <div className="flex-center mb-6">
                  <div className="icon-container">
                    <Shield className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Secure Authentication
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is protected with JWT authentication and secure
                  middleware.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card feature-card">
                <div className="flex-center mb-6">
                  <div className="icon-container">
                    <Zap className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Intuitive Interface</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Clean and responsive design that works on all devices.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card feature-card">
                <div className="flex-center mb-6">
                  <div className="icon-container">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Updates</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create, update, and delete todos with instant feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{ padding: "5rem 0", backgroundColor: "#f9fafb" }}
          className="dark:bg-gray-800"
        >
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6 text-gradient">
              Ready to Get Organized?
            </h2>
            {/* Fixed visibility - using inline style for maximum specificity */}
            <p
              className="text-xl font-medium mb-8 max-w-3xl mx-auto"
              style={{ color: "#000000" }}
            >
              Join thousands of users who are already managing their tasks
              efficiently.
            </p>
            <Link href="/register">
              <button className="btn btn-primary">Start Now</button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="logo-container">
            <div
              className="icon-container"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <ListTodo className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">TaskMaster</span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import TodoItem from "./todo-item";
import { AlertCircle, Plus, Loader2, ListTodo } from "lucide-react";
import { useRouter } from "next/navigation";

type Todo = {
  _id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
};

export default function TodoList() {
  // State for todos and UI states
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, logout } = useAuth();
  const router = useRouter();

  // Fetch todos on component mount
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchTodos();
  }, [token, router]);

  // Function to fetch todos from the API
  const fetchTodos = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token expired or invalid - logout and redirect to login
        logout();
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch todos");
      }

      const data = await response.json();
      setTodos(data.todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTodo.trim()) return;
    if (newTodo.length > 140) {
      setError("Todo content must not exceed 140 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newTodo }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add todo");
      }

      setNewTodo("");
      fetchTodos(); // Refresh the todo list
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to update a todo (content or completion status)
  const handleUpdateTodo = async (
    id: string,
    data: { content?: string; completed?: boolean }
  ) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error || "Failed to update todo");
      }

      // Update local state for immediate UI feedback
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, ...data } : todo))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Function to delete a todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete todo");
      }

      // Update local state for immediate UI feedback
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Show loading spinner while fetching todos
  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: "16rem" }}>
        <div style={{ textAlign: "center" }}>
          <Loader2
            className="h-12 w-12 animate-spin"
            style={{ color: "#3b82f6", margin: "0 auto", marginBottom: "1rem" }}
          />
          <p style={{ color: "#6b7280" }}>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: "48rem", margin: "0 auto" }}>
      <div className="card-header flex-between">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="icon-container">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>My Tasks</h2>
            <p style={{ color: "#6b7280" }}>Manage your tasks efficiently</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        {/* Form to add new todo */}
        <form
          onSubmit={handleAddTodo}
          style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}
        >
          <input
            placeholder="Add a new task (max 140 characters)"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            maxLength={140}
            className="form-input"
            style={{ flex: 1, paddingLeft: "1rem" }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            Add
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Todo list */}
        <div>
          {todos.length === 0 ? (
            <div className="empty-state">
              <div className="flex-center" style={{ marginBottom: "1rem" }}>
                <div
                  className="icon-container"
                  style={{ width: "4rem", height: "4rem" }}
                >
                  <ListTodo className="h-8 w-8" />
                </div>
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                No tasks yet
              </h3>
              <p style={{ color: "#6b7280" }}>Add a task to get started!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

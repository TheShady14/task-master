"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Todo type definition
type Todo = {
  _id: string;
  content: string;
  completed: boolean;
};

// TodoItem props type definition
type TodoItemProps = {
  todo: Todo;
  onUpdate: (
    id: string,
    data: { content?: string; completed?: boolean }
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  // State for editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Toggle todo completion status
  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(todo._id, { completed: !todo.completed });
    } finally {
      setIsUpdating(false);
    }
  };

  // Enter edit mode
  const handleEdit = () => {
    setEditContent(todo.content);
    setIsEditing(true);
  };

  // Save edited content
  const handleSaveEdit = async () => {
    if (editContent.trim() === "") return;

    setIsUpdating(true);
    try {
      await onUpdate(todo._id, { content: editContent });
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(todo.content);
  };

  // Delete todo
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo._id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? "todo-completed" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <div
          style={{
            width: "1.5rem",
            height: "1.5rem",
            borderRadius: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: todo.completed ? "#d1fae5" : "#f3f4f6",
            border: `2px solid ${todo.completed ? "#a7f3d0" : "#d1d5db"}`,
          }}
        >
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isUpdating}
            style={{
              width: "1rem",
              height: "1rem",
              accentColor: "#10b981",
            }}
          />
        </div>

        {isEditing ? (
          <input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="form-input"
            style={{ marginLeft: "1rem", flex: 1, paddingLeft: "1rem" }}
            maxLength={140}
            autoFocus
          />
        ) : (
          <span
            className="todo-text"
            style={{
              textDecoration: todo.completed ? "line-through" : "none",
              color: todo.completed ? "#9ca3af" : "inherit",
            }}
          >
            {todo.content}
          </span>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="btn btn-icon"
              style={{
                backgroundColor: "#d1fae5",
                color: "#10b981",
                border: "none",
              }}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn btn-icon"
              style={{
                backgroundColor: "#fee2e2",
                color: "#ef4444",
                border: "none",
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              disabled={isUpdating}
              className="btn btn-icon"
              style={{
                backgroundColor: "#dbeafe",
                color: "#3b82f6",
                border: "none",
              }}
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-icon"
              style={{
                backgroundColor: "#fee2e2",
                color: "#ef4444",
                border: "none",
              }}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

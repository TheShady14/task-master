import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Middleware to validate todo content length
// This satisfies the requirement to reject tasks over 140 characters
const validateTodoContent = (content: string) => {
  return content.length <= 140;
};

// GET - Fetch a specific todo by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get("x-user-id");
    const todoId = params.id;

    // Validate todo ID format
    if (!ObjectId.isValid(todoId)) {
      return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("todo-app");

    // Find todo by ID and ensure it belongs to the authenticated user
    const todo = await db.collection("todos").findOne({
      _id: new ObjectId(todoId),
      userId,
    });

    // Return 404 if todo not found
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ todo });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a specific todo by ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get("x-user-id");
    const todoId = params.id;

    // Validate todo ID format
    if (!ObjectId.isValid(todoId)) {
      return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
    }

    const { content, completed } = await request.json();

    // Validate todo content length if content is provided
    // This satisfies the requirement to reject tasks over 140 characters
    if (content && !validateTodoContent(content)) {
      return NextResponse.json(
        { error: "Todo content must not exceed 140 characters" },
        { status: 403 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("todo-app");

    // Create update object with only provided fields
    const updateData: any = { updatedAt: new Date() };
    if (content !== undefined) updateData.content = content;
    if (completed !== undefined) updateData.completed = completed;

    // Update todo in database
    const result = await db
      .collection("todos")
      .updateOne({ _id: new ObjectId(todoId), userId }, { $set: updateData });

    // Return 404 if todo not found
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific todo by ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user ID from request headers (set by middleware)
    const userId = request.headers.get("x-user-id");
    const todoId = params.id;

    // Validate todo ID format
    if (!ObjectId.isValid(todoId)) {
      return NextResponse.json({ error: "Invalid todo ID" }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("todo-app");

    // Delete todo from database
    const result = await db.collection("todos").deleteOne({
      _id: new ObjectId(todoId),
      userId,
    });

    // Return 404 if todo not found
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Middleware to validate todo content length
const validateTodoContent = (content: string) => {
  return content.length <= 140;
};

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("todo-app");

    const todos = await db
      .collection("todos")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ todos });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in request" },
        { status: 400 }
      );
    }

    const { content } = await request.json();

    // Validate todo content length
    if (!validateTodoContent(content)) {
      return NextResponse.json(
        { error: "Todo content must not exceed 140 characters" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("todo-app");

    const result = await db.collection("todos").insertOne({
      userId,
      content,
      completed: false,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Todo created successfully",
        todoId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

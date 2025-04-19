// Login API Route
// Handles user authentication and JWT token generation

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// JWT secret key for signing tokens
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check content type - middleware to reject non-JSON content types
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Only JSON content type is accepted" },
        { status: 403 }
      );
    }

    // Validate email - middleware to check if email ends with @gmail.com
    if (!email.endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Email must end with @gmail.com" },
        { status: 403 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("todo-app");

    // Find user in database
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with user information
    // This token will be used for authentication in protected routes
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return token and user info (excluding password)
    return NextResponse.json({
      token,
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

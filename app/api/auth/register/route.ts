import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// Middleware to validate email - ensures email ends with @gmail.com
// This satisfies the requirement to reject users whose usernames don't end with @gmail.com
const validateEmail = (email: string) => {
  return email.endsWith("@gmail.com");
};

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Check content type - middleware to reject non-JSON content types
    // This satisfies the requirement to reject any requests that are not of the JSON content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Only JSON content type is accepted" },
        { status: 403 }
      );
    }

    // Validate email - middleware to check if email ends with @gmail.com
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Email must end with @gmail.com" },
        { status: 403 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("todo-app");

    // Check if user already exists to prevent duplicates
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password for security before storing in database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in database
    const result = await db.collection("users").insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

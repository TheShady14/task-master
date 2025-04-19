import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// JWT secret key for verifying tokens
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "c96ad8ac51da60dc594987413b4f53d4e0966ed87e6afdbe311944b89e0b909";

export async function middleware(request: NextRequest) {
  // Only apply middleware to /api/todos routes (protected routes)
  if (!request.nextUrl.pathname.startsWith("/api/todos")) {
    return NextResponse.next();
  }

  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    // Check if email ends with @gmail.com
    // This satisfies the requirement to reject users whose usernames don't end with @gmail.com
    if (!payload.email || !payload.email.toString().endsWith("@gmail.com")) {
      return NextResponse.json(
        { error: "Forbidden - Invalid email domain" },
        { status: 403 }
      );
    }

    // Check content type for POST and PUT requests
    // This satisfies the requirement to reject any requests that are not of the JSON content type
    if (["POST", "PUT"].includes(request.method)) {
      const contentType = request.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return NextResponse.json(
          { error: "Only JSON content type is accepted" },
          { status: 403 }
        );
      }
    }

    // Add user info to request headers for route handlers to use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { error: "Unauthorized - Invalid token" },
      { status: 401 }
    );
  }
}

// Configure which routes this middleware applies to
export const config = {
  matcher: ["/api/todos/:path*"],
};

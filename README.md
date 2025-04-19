TaskMaster - Task Management Application
TaskMaster is a full-stack todo application with user authentication built using Next.js, MongoDB, and JWT authentication.

Features:
Secure Authentication: User data is protected with JWT authentication and secure middleware
Intuitive Interface: Clean and responsive design that works across all devices
Real-time Updates: Create, update, and delete todos with instant feedback
Dark Mode Support: Seamless switching between light and dark themes

Tech Stack

Frontend:

Next.js 13.4 (App Router)
React 18.2
Tailwind CSS
Radix UI Components
Lucide React Icons

Backend:

Next.js API Routes
MongoDB
JWT Authentication
bcryptjs for password hashing

Project Structure:
react-todo/
├── app/ # Next.js app router
│ ├── api/ # API routes
│ ├── login/ # Login page
│ ├── register/ # Registration page
│ ├── todos/ # Todo management pages
│ ├── globals.css # Global styles
│ ├── styles/ # Additional styles
│ ├── page.tsx # Landing page
│ ├── layout.tsx # Root layout
├── components/ # Reusable React components
├── contexts/ # React contexts (auth-context)
│ ├── auth-context.tsx # Authentication context
├── lib/ # Utility functions and helpers
├── middleware.ts # Next.js middleware for auth
└── public/ # Static files

Getting Started
Prerequisites:

Node.js 14.x or later
MongoDB instance (local or Atlas)

Installation:

Clone the repository:
bashgit clone https://github.com/yourusername/react-todo.git
cd react-todo

Install dependencies:
bashnpm install

Create an .env.local file in the root directory with the following variables:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Run the development server:
bashnpm run dev

Open http://localhost:3000 in your browser to see the application.

Building for Production
bashnpm run build
npm start
Authentication Flow

Users register with email and password
Passwords are hashed using bcryptjs before storage
On login, JWT tokens are issued to authenticate users
Protected routes are secured with middleware that verifies JWT tokens

License
MIT
Contributors

Your Name - GitHub Profile

Acknowledgments

Next.js
Tailwind CSS
MongoDB

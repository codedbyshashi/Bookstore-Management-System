📚 Bookstore Management System – Frontend
A modern, responsive frontend application for the Bookstore Management System, built with React 18 and Vite. This application provides a seamless shopping experience, featuring secure authentication, a dynamic cart system, multi-method checkout, and a comprehensive administrative dashboard.

The application connects to a containerized Spring Boot backend to deliver a high-performance, full-stack solution.

🚀 Live Demo
Component

URL

Frontend (Netlify)

View Live Demo

Backend API (Render)

API Endpoint

🏗 System Architecture
The application follows a modern cloud-native deployment strategy:

Plaintext

User 👤
  ↓
Netlify (React Frontend) 🌐
  ↓
HTTPS API Calls (Axios) ⚡
  ↓
Render (Spring Boot Backend in Docker) 🐳
  ↓
Neon PostgreSQL (Cloud Database) 🐘

🛠 Tech Stack
Frontend
Core: React 18, Vite

Styling: Tailwind CSS (Responsive Design)

Routing: React Router DOM

State & Networking: Axios, React Hooks

Feedback: React Toastify, React Icons

Backend (Integration)
Framework: Spring Boot, Hibernate / JPA

Security: Spring Security, JWT Authentication

Infrastructure
Containerization: Docker

Hosting: Render (Backend), Netlify (Frontend)

Database: Neon PostgreSQL (Serverless)

✨ Features
🌐 Public UI
Landing Page: Modern hero section and featured books.

Catalog: Browse and filter the complete collection of books.

Book Details: Deep dive into descriptions, pricing, and availability.

🔐 Authentication
Secure Login: Separate logic for Admin and User modes.

Registration: Easy user onboarding.

JWT Integration: Automatic token management via Axios interceptors.

🛒 Shopping Flow
Cart Management: Add, remove, and adjust quantities in real-time.

Multi-Method Checkout: Support for Debit Card, UPI, and Cash on Delivery (COD).

Payment Flow: Dedicated UPI verification page for secure transactions.

👨‍💼 Admin Panel
Dashboard: High-level overview of store activity.

Inventory Control: Full CRUD (Create, Read, Update, Delete) for book listings.

Order Management: Track and update statuses for all customer orders with pagination.

📂 Project Structure
Bash

frontend
│
├── src
│   ├── admin        # Admin dashboard and management components
│   ├── components   # Reusable UI components (Navbar, Footer, Cards)
│   ├── hooks        # Custom React hooks
│   ├── pages        # Page-level components (Home, Shop, Login)
│   ├── services     # API service calls using Axios
│   ├── utils        # Helper functions and formatting
│   │
│   ├── App.jsx      # Main application routing
│   ├── index.css    # Global styles & Tailwind directives
│   └── main.jsx     # Application entry point
│
├── package.json
└── README.md

📄 Important Routes
Route

Access

Description

/

Public

Landing page

/books

Public

Browse catalog

/login / /register

Public

Auth pages

/cart

User

Shopping cart summary

/checkout

User

Shipping and payment selection

/orders

User

Personal order history

/admin/dashboard

Admin

Store analytics overview

/admin/books

Admin

Inventory management

/admin/orders

Admin

Global order tracking

⚙ Installation
Follow these steps to set up the project locally:

Clone the repository:

Bash

git clone https://github.com/your-username/bookstore-frontend.git
cd bookstore-frontend

Install dependencies:

Bash

npm install

🌍 Environment Configuration
Create a .env file in the root directory and add your backend API URL:

Code snippet

# Local Development
VITE_API_BASE_URL=http://localhost:8080

# Production
VITE_API_BASE_URL=https://bookstore-backend-latest-ayxw.onrender.com

▶ Running the Project
Development Mode
Bash

npm run dev

Local URL: http://localhost:5173

Production Build
Bash

# Build the project
npm run build

# Preview the production build
npm run preview

🔗 API Integration
The frontend interacts with the following primary endpoints:

Auth: POST /api/auth/register, POST /api/auth/login

Books: GET /api/books, POST /api/books (Admin), DELETE /api/books/{id} (Admin)

Orders: GET /api/orders, POST /api/orders, PUT /api/orders/{id} (Admin status update)

📸 Screenshots
Add your screenshots here to showcase your UI

📚 Key Concepts Demonstrated
REST API Consumption: Handling asynchronous data with Axios.

Security: Role-Based Access Control (RBAC) and JWT handling.

State Management: Leveraging React hooks for complex UI states.

DevOps: Deployment pipelines using Netlify and Render.

Design: Implementing professional typography (Plus Jakarta Sans) and responsive layouts.

📌 Notes
Ensure the Backend API has the correct CORS configuration to allow requests from the frontend domain.

JWT tokens are securely stored in localStorage and attached to requests via Axios interceptors.

Legacy orders created before the payment update may display fallback labels in the UI.

📄 License
This project is developed for educational and portfolio purposes.

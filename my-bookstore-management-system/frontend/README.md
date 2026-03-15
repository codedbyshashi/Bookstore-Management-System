Bookstore Management System – Frontend

Frontend for the Bookstore Management System, built using React, Vite, Tailwind CSS, Axios, and React Router.

This application connects to a Spring Boot backend and provides a full online bookstore experience including authentication, cart, checkout, order management, and an admin dashboard.

🚀 Live Demo

Frontend (Netlify)
https://scintillating-alpaca-716c3a.netlify.app

Backend API (Render)
https://bookstore-backend-latest-ayxw.onrender.com

🏗 System Architecture
User
 ↓
Netlify (React Frontend)
 ↓
HTTPS API Calls
 ↓
Render (Spring Boot Backend running in Docker)
 ↓
Neon PostgreSQL (Cloud Database)

This architecture demonstrates a modern full-stack cloud deployment.

🛠 Tech Stack
Frontend

React 18

Vite

Tailwind CSS

Axios

React Router DOM

React Toastify

React Icons

Backend

Spring Boot

Spring Security

JWT Authentication

Hibernate / JPA

Infrastructure

Docker (containerized backend)

Render (backend hosting)

Netlify (frontend hosting)

Neon PostgreSQL (cloud database)

✨ Main Features
Public UI

polished landing page

featured books section

browse books catalog

book details page

Authentication

login page with Admin / User mode switch

registration page with improved UI

JWT authentication

automatic token handling with Axios

Shopping Flow
Cart

add/remove books

cart summary

Checkout

checkout form

payment method selection

Supported payment options:

debit card

UPI

cash on delivery

UPI Payment

dedicated UPI entry page

UPI ID validation before confirming payment

Orders

User order management includes:

paginated order history

payment method display

payment status display

order status tracking

Admin Panel

Admin users can access:

Admin Dashboard

overview of system activity

Book Management

add books

edit books

delete books

manage inventory

Order Management

view all orders

update order status

pagination support

📂 Folder Structure
frontend
│
├── src
│   ├── admin
│   ├── components
│   ├── hooks
│   ├── pages
│   ├── services
│   ├── utils
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
└── README.md
📄 Important Pages
Route	Description
/	landing page
/books	browse books
/books/:id	book details
/login	login
/register	registration
/cart	shopping cart
/checkout	checkout
/checkout/upi	UPI payment
/orders	user orders
/admin/dashboard	admin dashboard
/admin/books	admin book management
/admin/orders	admin order management
⚙ Installation

From the frontend directory:

npm install
🌍 Environment Configuration

Create a .env file.

Example:

VITE_API_BASE_URL=http://localhost:8080

For production this value points to the deployed backend API.

Example:

VITE_API_BASE_URL=https://bookstore-backend-latest-ayxw.onrender.com
▶ Run Development Server
npm run dev

Local development URL:

http://localhost:5173
📦 Production Build

Build the application:

npm run build

Preview production build locally:

npm run preview
🔗 API Integration
Authentication
POST /api/auth/register
POST /api/auth/login
Books
GET /api/books
GET /api/books/{id}
POST /api/books      (admin)
PUT /api/books/{id}  (admin)
DELETE /api/books/{id} (admin)
Orders
GET /api/orders
GET /api/orders/{id}
POST /api/orders
PUT /api/orders/{id}   (admin status update)
🎨 UI Design Notes

modern typography using
Plus Jakarta Sans and Space Grotesk

responsive layout using Tailwind CSS

improved book card design

fallback behavior for missing book images

centered authentication pages

improved checkout experience

📸 Screenshots

You can add screenshots of key pages here.

Example sections:

Landing Page
Books Catalog
Book Details
Cart
Checkout
Admin Dashboard
Admin Orders
📚 Key Concepts Demonstrated

This project demonstrates several important backend and frontend concepts:

REST API design

JWT authentication

role-based authorization (Admin / User)

pagination in APIs

CORS configuration

cloud database integration

Docker containerization

cloud deployment

frontend–backend integration

environment variable configuration

📌 Notes

the backend must allow the configured frontend domain via CORS

JWT tokens are stored in local storage

Axios automatically attaches the token to API requests

older orders created before payment-method support may display fallback labels

🔗 Related Files

Key files in the frontend:

API client

src/services/api.js

Routes

src/App.jsx

Homepage

src/pages/HomePage.jsx

Checkout

src/pages/CheckoutPage.jsx

UPI Payment

src/pages/UpiPaymentPage.jsx

Orders

src/pages/OrdersPage.jsx
🧠 Learning Outcome

Building this project involved understanding how real-world systems work, including:

full-stack architecture

cloud deployment

containerization

cross-origin communication

secure authentication flows

📄 License

This project is for educational and portfolio purposes.
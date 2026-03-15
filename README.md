# Bookstore Management System Frontend

A modern, responsive frontend for the Bookstore Management System, built with React 18 and Vite. It delivers a smooth shopping experience with secure authentication, a dynamic cart, multiple checkout options, and an admin dashboard for managing inventory and orders.

The frontend connects to a containerized Spring Boot backend to provide a full-stack bookstore experience backed by Neon PostgreSQL.

> Repository note: in this workspace, the frontend source lives in `my-bookstore-management-system/frontend`.

## Live Demo

| Component | URL |
| --- | --- |
| Frontend (Netlify) | [scintillating-alpaca-716c3a.netlify.app](https://scintillating-alpaca-716c3a.netlify.app) |
| Backend API (Render) | [bookstore-backend-latest-ayxw.onrender.com](https://bookstore-backend-latest-ayxw.onrender.com) |

## System Architecture

```text
User
  |
  v
Netlify (React Frontend)
  |
  v
HTTPS API Calls via Axios
  |
  v
Render (Spring Boot Backend in Docker)
  |
  v
Neon PostgreSQL
```

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify
- React Icons

### Backend Integration

- Spring Boot
- Hibernate / JPA
- Spring Security
- JWT authentication

### Infrastructure

- Docker
- Render
- Netlify
- Neon PostgreSQL

## Features

### Public UI

- Modern landing page with a hero section and featured books
- Catalog browsing with search, genre filters, and pagination
- Book details page with pricing and availability information

### Authentication

- User registration and login
- Separate access logic for admin and user areas
- JWT-based authentication
- Automatic token attachment through the shared Axios client

### Shopping Flow

- Real-time cart management
- Checkout flow with Debit Card, UPI, and Cash on Delivery
- Dedicated UPI payment page with UPI ID validation
- Order history with status and payment details

### Admin Panel

- Dashboard with summary cards for books, orders, and stock insights
- Full CRUD support for inventory management
- Order management with filtering, status updates, and pagination

## Project Structure

```text
Bookstore Management System
`-- my-bookstore-management-system
    |-- backend
    |   |-- src/main/java/com/example/bookstore
    |   |-- src/main/resources
    |   `-- pom.xml
    `-- frontend
        |-- src
        |   |-- admin
        |   |-- components
        |   |-- hooks
        |   |-- pages
        |   |-- services
        |   |-- utils
        |   |-- App.jsx
        |   |-- index.css
        |   `-- main.jsx
        |-- package.json
        `-- vite.config.js
```

## Important Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/books` | Public | Browse catalog |
| `/books/:id` | Public | Book details |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/cart` | User | Shopping cart summary |
| `/checkout` | User | Checkout and payment selection |
| `/checkout/upi` | User | Dedicated UPI payment flow |
| `/orders` | User | Personal order history |
| `/admin/dashboard` | Admin | Store overview |
| `/admin/books` | Admin | Inventory management |
| `/admin/orders` | Admin | Global order tracking |

## Installation

Clone the repository and move into the frontend app:

```bash
git clone <your-repository-url>
cd <your-repository-folder>/my-bookstore-management-system/frontend
npm install
```

## Environment Configuration

Create a `.env` file inside `my-bookstore-management-system/frontend`:

```env
# Local development
VITE_API_BASE_URL=http://localhost:8080

# Production
VITE_API_BASE_URL=https://bookstore-backend-latest-ayxw.onrender.com
```

## Running the Project

### Development

```bash
npm run dev
```

Vite runs locally at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## API Integration

The frontend primarily interacts with these endpoints:

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Books | `GET /api/books`, `GET /api/books/{id}`, `POST /api/books`, `PUT /api/books/{id}`, `DELETE /api/books/{id}` |
| Orders | `GET /api/orders`, `GET /api/orders/{id}`, `POST /api/orders`, `PUT /api/orders/{id}`, `PUT /api/orders/{id}/status` |

## Screenshots

Add screenshots here for:

- Landing page
- Catalog
- Book details
- Cart
- Checkout
- UPI payment page
- Admin dashboard
- Admin orders

## Key Concepts Demonstrated

- REST API consumption with Axios
- JWT authentication and role-based access control
- React hook-based state management
- Frontend and backend integration across separate deployments
- Cloud hosting with Netlify, Render, and Neon PostgreSQL
- Responsive UI design using Tailwind CSS, Plus Jakarta Sans, and Space Grotesk

## Notes

- Make sure the backend CORS configuration allows the deployed frontend domain.
- JWT data is persisted in `localStorage` and attached to requests through the shared Axios instance.
- Some legacy orders may show fallback payment labels if they were created before the payment flow update.

## License

This project is intended for educational and portfolio use.

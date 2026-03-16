# Bookstore Management System

A full-stack bookstore application with a React 18 + Vite frontend and a Spring Boot backend. The project covers public browsing, authentication, cart and checkout flows, order management, and an admin dashboard for managing books and store activity.

In this repository, the application code lives inside `my-bookstore-management-system/`.

## Live Deployment

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
HTTPS API calls via Axios
  |
  v
Render (Spring Boot backend in Docker)
  |
  v
Neon PostgreSQL
```

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, React Router DOM, Axios, React Toastify, React Icons |
| Backend | Spring Boot 2.7, Spring Security, Spring Data JPA, Hibernate, JWT, Bean Validation |
| Database | PostgreSQL |
| Tooling | Maven Wrapper, Docker, Vite |
| Hosting | Netlify, Render, Neon |

## Features

### Frontend

- Modern landing page with featured books
- Catalog browsing with search, genre filtering, and pagination
- Book details page
- Login and registration flows
- JWT-based auth persistence in the client
- Cart management with real-time quantity updates
- Checkout flow for Debit Card, UPI, and Cash on Delivery
- Dedicated UPI payment confirmation page
- User order history with payment and order status visibility

### Backend

- REST APIs for auth, books, and orders
- Role-based access control for admin and user flows
- JWT-secured endpoints with Spring Security
- Paginated book and order responses
- Admin-only book creation, update, and deletion
- Admin order status management
- Swagger UI support for API inspection
- Dockerized backend deployment

### Admin Experience

- Dashboard with totals for books, orders, completed orders, and low-stock items
- Book inventory CRUD management
- Paginated order management with status filters
- Ability to mark orders as completed or cancelled

## Repository Structure

```text
Bookstore Management System
`-- my-bookstore-management-system
    |-- backend
    |   |-- src/main/java/com/example/bookstore
    |   |   |-- config
    |   |   |-- controller
    |   |   |-- dto
    |   |   |-- exception
    |   |   |-- model
    |   |   |-- repository
    |   |   |-- security
    |   |   `-- service
    |   |-- src/main/resources
    |   |   |-- application.properties
    |   |   `-- data.sql
    |   |-- Dockerfile
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

## Frontend Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/books` | Public | Browse catalog |
| `/books/:id` | Public | Book details |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/cart` | User | Shopping cart |
| `/checkout` | User | Checkout and payment selection |
| `/checkout/upi` | User | UPI payment flow |
| `/orders` | User | Personal order history |
| `/admin/dashboard` | Admin | Dashboard overview |
| `/admin/books` | Admin | Inventory management |
| `/admin/orders` | Admin | Global order management |

## Backend API Overview

| Area | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Books | `GET /api/books`, `GET /api/books/{id}`, `POST /api/books`, `PUT /api/books/{id}`, `DELETE /api/books/{id}` |
| Orders | `GET /api/orders`, `GET /api/orders/{id}`, `POST /api/orders`, `PUT /api/orders/{id}` |
| Docs | `/swagger-ui/index.html`, `/v3/api-docs` |

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Java 17+ for local Spring Boot development
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <your-repository-folder>/my-bookstore-management-system
```

### 2. Configure the Backend for Local Development

Update `backend/src/main/resources/application.properties` with your local values, or override them using environment variables.

Recommended local values:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookstore
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

frontend.url=http://localhost:5173
server.port=8080

jwt.secret=change-this-secret-for-local-dev
jwt.expiration=3600000
```

Important:

- The current repository contains concrete database credentials in `backend/src/main/resources/application.properties`.
- For local work and production, replace them or override them with your own environment-specific values.
- Do not commit real secrets to source control.

### 3. Configure the Frontend for Local Development

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 4. Install Dependencies

Frontend:

```bash
cd frontend
npm install
cd ..
```

Backend dependencies are handled through the Maven wrapper.

### 5. Run the Backend

From `my-bookstore-management-system/backend`:

Windows:

```bash
mvnw.cmd spring-boot:run
```

macOS / Linux:

```bash
./mvnw spring-boot:run
```

### 6. Run the Frontend

From `my-bookstore-management-system/frontend`:

```bash
npm run dev
```

### 7. Local URLs

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:8080` |
| Swagger UI | `http://localhost:8080/swagger-ui/index.html` |

## Demo Accounts

The backend bootstraps demo users on startup if they do not already exist:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `password` |
| User | `user@example.com` | `password` |

Note:

- Additional sample books and orders exist in `backend/src/main/resources/data.sql`.
- If you want that data locally, import it into your database or enable SQL initialization for your environment.

## Production Deployment

### Frontend Production

Build the frontend from `my-bookstore-management-system/frontend`:

```bash
npm run build
```

Deployment notes:

- Build command: `npm run build`
- Publish directory: `dist`
- Required environment variable: `VITE_API_BASE_URL=https://bookstore-backend-latest-ayxw.onrender.com`

### Backend Production

The backend includes a Dockerfile in `my-bookstore-management-system/backend/Dockerfile`.

Build locally:

```bash
cd backend
docker build -t bookstore-backend .
```

Run locally with Docker:

```bash
docker run -p 8080:8080 bookstore-backend
```

Recommended production environment variables:

| Variable | Purpose | Example |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | PostgreSQL connection string | `jdbc:postgresql://<host>:5432/<db>` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `bookstore_user` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `change-me` |
| `FRONTEND_URL` | Allowed frontend origin for CORS | `https://your-frontend.netlify.app` |
| `PORT` | Backend server port | `8080` |
| `JWT_SECRET` | JWT signing secret | `use-a-long-random-secret` |
| `JWT_EXPIRATION` | Token lifetime in milliseconds | `3600000` |

Deployment notes:

- Make sure `FRONTEND_URL` exactly matches the frontend domain.
- Use secure production secrets instead of the values currently committed in `application.properties`.
- Render can build the backend directly from the Dockerfile in the `backend` folder.

## Build Commands

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
mvnw.cmd clean package
```

macOS / Linux:

```bash
cd backend
./mvnw clean package
```

## Operational Notes

- The frontend Axios client uses `VITE_API_BASE_URL` and automatically attaches the JWT token after login.
- The backend allows public access to auth routes, Swagger routes, and `GET /api/books`.
- Book creation, updates, and deletes are admin-only.
- Order reads are user/admin protected, and non-admin users only see their own orders.
- Security config uses `FRONTEND_URL` for CORS, and `BookController` plus `OrderController` currently also include `@CrossOrigin(origins = "http://localhost:5173")`, so update those values if you deploy the frontend to a different domain.
- `spring.jpa.hibernate.ddl-auto=update` is enabled, which is convenient for development but should be reviewed for stricter production workflows.

## Screenshots

Suggested sections to add:

- Home page
- Books catalog
- Book details
- Cart
- Checkout
- UPI payment page
- Admin dashboard
- Admin books
- Admin orders
- Swagger UI

## License

This project is intended for educational and portfolio use.

# Bookstore Management System

A full-stack bookstore platform built with React, Vite, Tailwind CSS, Spring Boot, Spring Security, JPA, and PostgreSQL.

It includes a public storefront, JWT-based authentication, a customer checkout flow, and an admin control center for inventory and order operations.

## Highlights

### Storefront
- polished landing page with featured books
- full catalog with backend pagination and filters
- detailed book pages with stock-aware quantity selection
- save-for-later star toggle on book cards
- cart flow with quantity updates and stock validation

### Authentication
- registration page
- login page with separate admin and user mode selection
- JWT auth with persisted frontend session
- protected routes for customer and admin areas

### Checkout and Orders
- payment options:
  - debit card
  - UPI
  - cash on delivery
- dedicated UPI payment page with UPI ID validation
- orders now store real line items with quantity and amount snapshots
- stock is reserved when an order is placed
- cancelling an order restores stock
- users can view detailed order history with totals, payment state, timestamps, and item breakdowns

### Admin Experience
- sticky admin sidebar and dashboard layout
- book management with add, edit, delete, and stock updates
- improved add/edit book modal
- admin dashboard with:
  - inventory watchlist
  - stock alerts
  - order flow snapshot
  - popular titles
  - recent order activity
- admin order management with:
  - status filters
  - payment filters
  - line-item visibility
  - mark paid
  - complete
  - cancel
  - reopen cancelled orders

### Admin Shopping Restrictions
- admins do not use the customer cart or checkout flow
- admin accounts are redirected to inventory and order management instead

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify
- React Icons

### Backend
- Java 17
- Spring Boot 2.7
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- JWT authentication
- Springdoc OpenAPI / Swagger UI

## Project Structure

```text
my-bookstore-management-system
|-- backend
|   |-- src/main/java/com/example/bookstore
|   |   |-- config
|   |   |-- controller
|   |   |-- dto
|   |   |-- model
|   |   |-- repository
|   |   `-- service
|   `-- src/main/resources
|-- frontend
|   |-- public
|   |-- src/admin
|   |-- src/components
|   |-- src/hooks
|   |-- src/pages
|   |-- src/services
|   `-- src/utils
`-- README.md
```

## Main Routes

### Public / User
- `/` - landing page
- `/books` - browse books
- `/books/:id` - book details
- `/login` - login
- `/register` - register
- `/cart` - shopping cart
- `/checkout` - checkout
- `/checkout/upi` - UPI payment
- `/orders` - customer order history

### Admin
- `/admin/dashboard` - dashboard
- `/admin/books` - book management
- `/admin/orders` - order management

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd my-bookstore-management-system
```

### 2. Configure the backend

Edit:

`backend/src/main/resources/application.properties`

Make sure these values are correct for your environment:
- PostgreSQL connection URL
- database username and password
- `frontend.url`
- `server.port` if needed
- JWT secret and expiration

Important:
- do not keep real production credentials in source control
- rotate any secrets before real deployment

### 3. Configure the frontend

Create or update:

`frontend/.env`

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For production, set this to your deployed backend URL.

### 4. Run the backend

From the `backend` folder:

```bash
mvn spring-boot:run
```

On Windows you can also use:

```bash
mvnw.cmd spring-boot:run
```

### 5. Run the frontend

From the `frontend` folder:

```bash
npm install
npm run dev
```

Vite usually starts on:

```text
http://localhost:5173
```

## Build Commands

### Frontend

```bash
npm run build
```

### Backend

```bash
mvn -q -DskipTests compile
```

## Deployment Notes

### Frontend SPA Routing

Netlify needs the redirect file below so refreshing nested routes does not return `404`:

`frontend/public/_redirects`

Contents:

```text
/* /index.html 200
```

### Backend Schema Updates

The backend uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

After pulling the latest order-system changes, restart the backend so Hibernate can create or update:
- order snapshot columns like item count and total amount
- the `order_items` table used for line-item storage

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Books
- `GET /api/books`
- `GET /api/books/{id}`
- `POST /api/books` admin only
- `PUT /api/books/{id}` admin only
- `DELETE /api/books/{id}` admin only

### Orders
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `PUT /api/orders/{id}` admin order and payment updates

Swagger UI is available when the backend is running:

```text
http://localhost:8080/swagger-ui/index.html
```

## Current Order Behavior

- orders store item-level snapshots, not just raw book IDs
- order totals and item counts are returned to the frontend
- older orders created before line-item support still load through backend fallback mapping
- users cannot order more than available stock
- cancelling an order restores stock
- reopening a cancelled order checks stock again before reserving inventory

## Production Suggestions

- move secrets out of `application.properties`
- remove or replace bootstrap/demo account seeding before public release
- add backend tests for stock reservation and order status transitions
- add frontend tests for checkout and admin order flows
- add CI for frontend and backend builds
- consider image validation or upload storage for book covers

## License

This project currently has no explicit license file. Add one if you plan to publish or distribute it.

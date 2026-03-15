# Bookstore Management System

A full-stack bookstore application built with React, Vite, Tailwind CSS, Spring Boot, Spring Security, JPA, and PostgreSQL.

The project includes:
- public storefront pages
- JWT-based login and registration
- cart and checkout flows
- UPI / debit card / cash-on-delivery payment selection
- user order history with pagination
- admin dashboard, book management, and order management

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

## Current Features

### Storefront
- polished landing page with featured books
- books listing page with pagination/filter support from backend
- individual book details
- cart management

### Authentication
- register page
- login page with separate admin/user mode selection
- JWT token storage on the frontend
- protected routes for user/admin areas

### Checkout and Payments
- checkout page with payment options:
  - debit card
  - UPI
  - cash on delivery
- dedicated UPI payment page
- payment method and payment status saved with orders

### User Area
- my orders page
- user-only paginated order history
- payment method and payment status display

### Admin Area
- admin dashboard
- manage books
- manage orders
- update order status

## Project Structure

```text
my-bookstore-management-system
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
|   `-- src/main/resources
|-- frontend
|   |-- src/admin
|   |-- src/components
|   |-- src/hooks
|   |-- src/pages
|   |-- src/services
|   `-- src/utils
`-- README.md
```

## Main Frontend Routes

- `/` - landing page
- `/books` - browse books
- `/books/:id` - book details
- `/login` - login
- `/register` - register
- `/cart` - shopping cart
- `/checkout` - checkout
- `/checkout/upi` - UPI payment screen
- `/orders` - user order history
- `/admin/dashboard` - admin dashboard
- `/admin/books` - admin book management
- `/admin/orders` - admin order management

## Local Setup

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd my-bookstore-management-system
```

## 2. Configure the backend

Edit:

`backend/src/main/resources/application.properties`

Make sure these values are correct for your environment:
- PostgreSQL connection URL
- database username/password
- `frontend.url`
- `server.port` if needed
- JWT secret / expiration

Important:
- do not keep real production database credentials or secrets committed to source control
- replace any hardcoded secrets before deployment

## 3. Configure the frontend

Create or update:

`frontend/.env`

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If you are using a deployed backend, set it to that backend URL instead.

## 4. Run the backend

From the `backend` folder:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

If you already have Maven installed, you can also use:

```bash
mvn spring-boot:run
```

## 5. Run the frontend

From the `frontend` folder:

```bash
npm install
npm run dev
```

The Vite dev server usually starts at:

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
./mvnw clean package
```

## API Notes

Main API groups:
- `/api/auth`
- `/api/books`
- `/api/orders`

Swagger UI is available when the backend is running:

```text
http://localhost:8080/swagger-ui/index.html
```

Depending on your Springdoc setup, `/swagger-ui.html` may also work.

## Development Notes

- the backend bootstraps sample admin and user accounts on first startup if they do not exist
- Hibernate is configured with `spring.jpa.hibernate.ddl-auto=update`
- frontend auth state is persisted with local storage
- user orders are paginated
- admin order listing is paginated

## Suggested Cleanup Before Production

- move secrets out of `application.properties`
- replace bootstrap demo accounts with an environment-based seed strategy
- add backend tests for order/payment flows
- add image hosting / validation for book covers
- add CI for frontend and backend builds

## License

This project currently has no explicit license file. Add one if you plan to publish or distribute it.

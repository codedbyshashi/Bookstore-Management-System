# Bookstore Management System (React + Vite Frontend)

## Project Description

This is a modern frontend implementation for the Bookstore Management System. It consumes an existing Spring Boot REST API backend and supports authentication, book management, and orders.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Toastify

## Folder Structure

- `src/components`: Reusable UI components (Navbar, Footer, BookCard, SearchBar, Pagination, LoadingSpinner).
- `src/pages`: Route pages (Home, Books, Book Details, Login, Register, Cart, Checkout, Orders, Admin pages).
- `src/services`: API layers using Axios (`api.js`, `bookService.js`, `orderService.js`).
- `src/hooks`: React hooks (`useAuth`, `useQuery`).
- `src/utils`: Utility functions like currency formatting.
- `src/assets`: Static assets placeholders.

## Installation

1. Go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set API base URL in `.env`:
   ```text
   VITE_API_BASE_URL=http://localhost:8080
   ```

## Running

```bash
npm run dev
```

Open `http://localhost:5173`.

## API Integration

### Auth
- `POST /api/register` -> Register a new user
- `POST /api/login` -> Login and receive JWT token

JWT token stored in `localStorage` and set in Axios headers automatically. Logout removes the token.

### Books
- `GET /api/books` (with query params `page`, `size`, `search`, `genre`)
- `GET /api/books/{id}`
- `POST /api/books` (admin)
- `PUT /api/books/{id}` (admin)
- `DELETE /api/books/{id}` (admin)

### Orders
- `POST /api/orders`
- `GET /api/orders` (user/admin)
- `GET /api/orders/{id}`
- `PUT /api/orders/{id}/status` (admin)

## Features

- Authentication with JWT
- Role-based UI (admin vs customer)
- Responsive book grid
- Search, filter, pagination
- Cart and checkout flow
- Order history and admin order workflow
- Toast notifications and loading states

## Screenshots

- Home page: `./screenshots/home.png`
- Book list: `./screenshots/books.png`
- Book details: `./screenshots/book-details.png`
- Cart: `./screenshots/cart.png`
- Checkout: `./screenshots/checkout.png`
- Admin dashboard: `./screenshots/admin-orders.png`

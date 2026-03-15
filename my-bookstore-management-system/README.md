# Bookstore Management System

## Overview
The Bookstore Management System is a Spring Boot application that provides a RESTful API for managing books, user authentication, and order processing. This system allows users to register, log in, browse books, and place orders.

## Features
- User authentication with JWT
- Role-based access control
- CRUD operations for books
- Order processing and management
- Global exception handling

## Technologies Used
- Java
- Spring Boot
- Spring Security
- JPA/Hibernate
- MySQL (or any other relational database)
- Maven

## Project Structure
```
my-bookstore-management-system
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── bookstore
│   │   │               ├── BookstoreManagementSystemApplication.java
│   │   │               ├── config
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── BookController.java
│   │   │               │   └── OrderController.java
│   │   │               ├── dto
│   │   │               │   ├── BookDto.java
│   │   │               │   ├── LoginRequest.java
│   │   │               │   └── OrderDto.java
│   │   │               ├── exception
│   │   │               │   └── GlobalExceptionHandler.java
│   │   │               ├── model
│   │   │               │   ├── Book.java
│   │   │               │   ├── Order.java
│   │   │               │   └── User.java
│   │   │               ├── repository
│   │   │               │   ├── BookRepository.java
│   │   │               │   ├── OrderRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── security
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── JwtTokenProvider.java
│   │   │               └── service
│   │   │                   ├── BookService.java
│   │   │                   ├── OrderService.java
│   │   │                   └── UserService.java
│   │   └── resources
│   │       ├── application.properties
│   │       └── data.sql
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── bookstore
│                       └── BookstoreManagementSystemApplicationTests.java
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-bookstore-management-system
   ```
3. Build the project using Maven:
   ```
   ./mvnw clean install
   ```
4. Configure the database connection in `src/main/resources/application.properties`.
5. Run the application:
   ```
   ./mvnw spring-boot:run
   ```

## Usage
- **Authentication**: Use the `/api/auth/register` endpoint to register a new user and `/api/auth/login` to authenticate.
- **Books**: Access book-related endpoints under `/api/books`.
- **Orders**: Manage orders through the `/api/orders` endpoints.

## License
This project is licensed under the MIT License.
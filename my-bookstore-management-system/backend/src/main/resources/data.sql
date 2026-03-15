INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', '$2a$10$0vwTad/8EoKzVpePm8dLmeQbDQmnxVXP1YgEFqxxN5BbzNszBPgG2', 'ROLE_ADMIN'),
('Regular User', 'user@example.com', '$2a$10$0vwTad/8EoKzVpePm8dLmeQbDQmnxVXP1YgEFqxxN5BbzNszBPgG2', 'ROLE_USER');

INSERT INTO books (title, author, genre, isbn, price, description, stock_quantity, image_url) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '9780743273565', 10.99, 'A novel set in the Roaring Twenties.', 100, 'http://example.com/gatsby.jpg'),
('1984', 'George Orwell', 'Dystopian', '9780451524935', 8.99, 'A dystopian novel about totalitarianism.', 50, 'http://example.com/1984.jpg'),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '9780061120084', 7.99, 'A novel about racial injustice in the Deep South.', 75, 'http://example.com/mockingbird.jpg');

-- Orders are managed via JPA element collection (order_book_ids), so explicit ordered_books column does not exist.
INSERT INTO orders (user_id, order_status, payment_status) VALUES 
(1, 'COMPLETED', 'PAID'),
(2, 'PENDING', 'UNPAID');
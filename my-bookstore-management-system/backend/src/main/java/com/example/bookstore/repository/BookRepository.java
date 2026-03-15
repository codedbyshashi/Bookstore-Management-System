package com.example.bookstore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.bookstore.model.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    org.springframework.data.domain.Page<Book> findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCase(String title,
            String genre, org.springframework.data.domain.Pageable pageable);
}
package com.example.bookstore.service;

import com.example.bookstore.dto.BookDto;
import com.example.bookstore.model.Book;
import com.example.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream().map(this::mapToDto).toList();
    }

    public Optional<BookDto> getBookById(Long id) {
        return bookRepository.findById(id).map(this::mapToDto);
    }

    public BookDto addBook(BookDto bookDto) {
        Book book = mapToEntity(bookDto);
        Book saved = bookRepository.save(book);
        return mapToDto(saved);
    }

    public BookDto updateBook(Long id, BookDto bookDto) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));
        book.setTitle(bookDto.getTitle());
        book.setAuthor(bookDto.getAuthor());
        book.setGenre(bookDto.getGenre());
        book.setIsbn(bookDto.getIsbn());
        book.setPrice(bookDto.getPrice());
        book.setDescription(bookDto.getDescription());
        book.setStockQuantity(bookDto.getStockQuantity());
        book.setImageUrl(bookDto.getImageUrl());
        return mapToDto(bookRepository.save(book));
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public Page<BookDto> getBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(this::mapToDto);
    }

    public Page<BookDto> getBooks(String search, String genre, Pageable pageable) {
        String searchTerm = (search == null) ? "" : search.trim();
        String genreTerm = (genre == null) ? "" : genre.trim();
        return bookRepository
                .findByTitleContainingIgnoreCaseAndGenreContainingIgnoreCase(searchTerm, genreTerm, pageable)
                .map(this::mapToDto);
    }

    private BookDto mapToDto(Book book) {
        BookDto dto = new BookDto();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setGenre(book.getGenre());
        dto.setIsbn(book.getIsbn());
        dto.setPrice(book.getPrice());
        dto.setDescription(book.getDescription());
        dto.setStockQuantity(book.getStockQuantity());
        dto.setImageUrl(book.getImageUrl());
        return dto;
    }

    private Book mapToEntity(BookDto dto) {
        Book book = new Book();
        if (dto.getId() != null) {
            book.setId(dto.getId());
        }
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setGenre(dto.getGenre());
        book.setIsbn(dto.getIsbn());
        book.setPrice(dto.getPrice());
        book.setDescription(dto.getDescription());
        book.setStockQuantity(dto.getStockQuantity());
        book.setImageUrl(dto.getImageUrl());
        return book;
    }
}
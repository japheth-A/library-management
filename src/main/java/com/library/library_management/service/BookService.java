package com.library.library_management.service;

import com.library.library_management.model.Book;
import com.library.library_management.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Book not found: " + id));
    }

    public Book createBook(Book book) {

        if (book.getQuantity() < 0) {
            throw new RuntimeException("Quantity cannot be negative");
        }

        if (book.getAvailableQuantity() < 0) {
            book.setAvailableQuantity(0);
        }

        if (book.getAvailableQuantity() > book.getQuantity()) {
            book.setAvailableQuantity(book.getQuantity());
        }

        return bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updatedBook) {

        Book existingBook = getBookById(id);

        existingBook.setTitle(updatedBook.getTitle());
        existingBook.setAuthor(updatedBook.getAuthor());
        existingBook.setIsbn(updatedBook.getIsbn());
        existingBook.setCategory(updatedBook.getCategory());
        existingBook.setQuantity(updatedBook.getQuantity());
        existingBook.setAvailableQuantity(updatedBook.getAvailableQuantity());

        return bookRepository.save(existingBook);
    }

    public void deleteBook(Long id) {

        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Book not found: " + id);
        }

        bookRepository.deleteById(id);
    }
}
package com.library.library_management.service;

import com.library.library_management.model.Book;
import com.library.library_management.model.Borrowing;
import com.library.library_management.model.BorrowingStatus;
import com.library.library_management.model.Member;
import com.library.library_management.model.User;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.BorrowingRepository;
import com.library.library_management.repository.MemberRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    public BorrowingService(
            BorrowingRepository borrowingRepository,
            BookRepository bookRepository,
            MemberRepository memberRepository,
            UserRepository userRepository
    ) {
        this.borrowingRepository = borrowingRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    // =====================================================
    // MEMBER BORROWING
    // =====================================================

    public Borrowing borrowBook(
            Long bookId,
            Long memberId,
            LocalDate dueDate
    ) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Book not found: " + bookId
                        ));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Member not found: " + memberId
                        ));

        checkBorrowingRules(book, dueDate);

        Borrowing borrowing = new Borrowing();

        borrowing.setBook(book);
        borrowing.setMember(member);
        borrowing.setBorrowDate(LocalDate.now());
        borrowing.setDueDate(dueDate);
        borrowing.setStatus(BorrowingStatus.BORROWED);

        book.setAvailableQuantity(
                book.getAvailableQuantity() - 1
        );

        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    // =====================================================
    // USER BORROWING
    // =====================================================

    public Borrowing borrowBookForUser(
            Long bookId,
            Long userId,
            LocalDate dueDate
    ) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Book not found: " + bookId
                        ));

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found: " + userId
                        ));

        checkBorrowingRules(book, dueDate);

        Borrowing borrowing = new Borrowing();

        borrowing.setBook(book);
        borrowing.setUser(user);
        borrowing.setBorrowDate(LocalDate.now());
        borrowing.setDueDate(dueDate);
        borrowing.setStatus(BorrowingStatus.BORROWED);

        book.setAvailableQuantity(
                book.getAvailableQuantity() - 1
        );

        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    // =====================================================
    // BORROWING RULES
    // =====================================================

    private void checkBorrowingRules(
            Book book,
            LocalDate dueDate
    ) {

        if (book.getAvailableQuantity() <= 0) {
            throw new RuntimeException(
                    "This book is currently unavailable"
            );
        }

        if (dueDate == null) {
            throw new RuntimeException(
                    "Due date is required"
            );
        }

        if (dueDate.isBefore(LocalDate.now())) {
            throw new RuntimeException(
                    "Due date cannot be in the past"
            );
        }
    }

    // =====================================================
    // GET ALL BORROWINGS
    // =====================================================

    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }

    // =====================================================
    // GET BORROWING
    // =====================================================

    public Borrowing getBorrowingById(Long id) {

        return borrowingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Borrowing not found: " + id
                        ));
    }

    // =====================================================
    // GET USER BORROWINGS
    // =====================================================

    public List<Borrowing> getUserBorrowings(Long userId) {
        return borrowingRepository.findByUserId(userId);
    }

    // =====================================================
    // GET MEMBER BORROWINGS
    // =====================================================

    public List<Borrowing> getMemberBorrowings(Long memberId) {
        return borrowingRepository.findByMemberId(memberId);
    }

    // =====================================================
    // RETURN BOOK
    // =====================================================

    public Borrowing returnBook(Long borrowingId) {

        Borrowing borrowing = getBorrowingById(borrowingId);

        if (borrowing.getStatus() == BorrowingStatus.RETURNED) {
            throw new RuntimeException(
                    "This book has already been returned"
            );
        }

        Book book = borrowing.getBook();

        book.setAvailableQuantity(
                book.getAvailableQuantity() + 1
        );

        borrowing.setReturnDate(LocalDate.now());
        borrowing.setStatus(BorrowingStatus.RETURNED);

        bookRepository.save(book);

        return borrowingRepository.save(borrowing);
    }

    // =====================================================
    // DELETE BORROWING
    // =====================================================

    public void deleteBorrowing(Long id) {

        if (!borrowingRepository.existsById(id)) {
            throw new RuntimeException(
                    "Borrowing not found: " + id
            );
        }

        borrowingRepository.deleteById(id);
    }

    // =====================================================
    // UPDATE OVERDUE STATUS
    // =====================================================

    public void updateOverdueBorrowings() {

        List<Borrowing> borrowings =
                borrowingRepository.findByStatus(
                        BorrowingStatus.BORROWED
                );

        LocalDate today = LocalDate.now();

        for (Borrowing borrowing : borrowings) {

            if (borrowing.getDueDate() != null &&
                    borrowing.getDueDate().isBefore(today)) {

                borrowing.setStatus(
                        BorrowingStatus.OVERDUE
                );

                borrowingRepository.save(borrowing);
            }
        }
    }
}
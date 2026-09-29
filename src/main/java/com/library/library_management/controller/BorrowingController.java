package com.library.library_management.controller;

import com.library.library_management.model.Borrowing;
import com.library.library_management.service.BorrowingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrowings")
@CrossOrigin(origins = "*")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(
            BorrowingService borrowingService
    ) {
        this.borrowingService = borrowingService;
    }

    // ==========================================
    // GET ALL BORROWINGS
    // ==========================================

    @GetMapping
    public List<Borrowing> getAllBorrowings() {

        return borrowingService.getAllBorrowings();
    }

    // ==========================================
    // GET ONE BORROWING
    // ==========================================

    @GetMapping("/{id}")
    public Borrowing getBorrowing(
            @PathVariable Long id
    ) {

        return borrowingService.getBorrowingById(id);
    }

    // ==========================================
    // MEMBER BORROW
    // ==========================================

    @PostMapping("/borrow")
    public Borrowing borrowBook(
            @RequestParam Long bookId,
            @RequestParam Long memberId,
            @RequestParam String dueDate
    ) {

        return borrowingService.borrowBook(
                bookId,
                memberId,
                LocalDate.parse(dueDate)
        );
    }

    // ==========================================
    // USER BORROW
    // ==========================================

    @PostMapping("/user/borrow")
    public Borrowing userBorrowBook(
            @RequestParam Long bookId,
            @RequestParam Long userId,
            @RequestParam String dueDate
    ) {

        return borrowingService.borrowBookForUser(
                bookId,
                userId,
                LocalDate.parse(dueDate)
        );
    }

    // ==========================================
    // GET USER BORROWINGS
    // ==========================================

    @GetMapping("/user/{userId}")
    public List<Borrowing> getUserBorrowings(
            @PathVariable Long userId
    ) {

        return borrowingService.getUserBorrowings(userId);
    }

    // ==========================================
    // GET MEMBER BORROWINGS
    // ==========================================

    @GetMapping("/member/{memberId}")
    public List<Borrowing> getMemberBorrowings(
            @PathVariable Long memberId
    ) {

        return borrowingService.getMemberBorrowings(memberId);
    }

    // ==========================================
    // RETURN BOOK
    // ==========================================

    @PutMapping("/{id}/return")
    public Borrowing returnBook(
            @PathVariable Long id
    ) {

        return borrowingService.returnBook(id);
    }

    // ==========================================
    // DELETE BORROWING
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBorrowing(
            @PathVariable Long id
    ) {

        borrowingService.deleteBorrowing(id);

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "Borrowing deleted successfully"
                )
        );
    }

    // ==========================================
    // UPDATE OVERDUE
    // ==========================================

    @PutMapping("/update-overdue")
    public ResponseEntity<?> updateOverdue() {

        borrowingService.updateOverdueBorrowings();

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message",
                        "Overdue borrowings updated"
                )
        );
    }
}
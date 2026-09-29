package com.library.library_management.repository;

import com.library.library_management.model.Borrowing;
import com.library.library_management.model.BorrowingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

    List<Borrowing> findByUserId(Long userId);

    List<Borrowing> findByMemberId(Long memberId);

    List<Borrowing> findByStatus(BorrowingStatus status);

    List<Borrowing> findByBookId(Long bookId);
}
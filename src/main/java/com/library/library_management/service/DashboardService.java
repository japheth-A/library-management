package com.library.library_management.service;

import com.library.library_management.model.BorrowingStatus;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.BorrowingRepository;
import com.library.library_management.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BorrowingRepository borrowingRepository;

    public DashboardService(
            BookRepository bookRepository,
            MemberRepository memberRepository,
            BorrowingRepository borrowingRepository) {

        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
        this.borrowingRepository = borrowingRepository;
    }

    public Map<String, Long> getStatistics() {

        Map<String, Long> statistics =
                new HashMap<>();

        statistics.put(
                "totalBooks",
                bookRepository.count()
        );

        statistics.put(
                "totalMembers",
                memberRepository.count()
        );

        statistics.put(
                "totalBorrowings",
                borrowingRepository.count()
        );

        statistics.put(
                "activeBorrowings",
                (long) borrowingRepository
                        .findByStatus(
                                BorrowingStatus.BORROWED
                        )
                        .size()
        );

        statistics.put(
                "returnedBooks",
                (long) borrowingRepository
                        .findByStatus(
                                BorrowingStatus.RETURNED
                        )
                        .size()
        );

        statistics.put(
                "overdueBooks",
                (long) borrowingRepository
                        .findByStatus(
                                BorrowingStatus.OVERDUE
                        )
                        .size()
        );

        return statistics;
    }
}
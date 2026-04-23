package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String reason;

    private LocalDate startDate;
    private LocalDate endDate;

    @Column(length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, PENDING_ADMIN, APPROVED, REJECTED

    @Column(length = 20)
    private String type; // MEDICAL, PERSONAL, ACADEMIC
}

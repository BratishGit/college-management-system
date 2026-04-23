package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private Double totalAmount;

    @Builder.Default
    private Double paidAmount = 0.0;

    private LocalDate dueDate;

    @Column(length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, PARTIAL, PAID, OVERDUE

    private Integer semester;
}

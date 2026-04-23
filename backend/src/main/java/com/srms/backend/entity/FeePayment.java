package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fee_payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeePayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fee_id", nullable = false)
    private Fee fee;

    @Column(nullable = false)
    private Double amount;

    @Builder.Default
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Column(unique = true, length = 100)
    private String transactionId;

    @Column(length = 50)
    private String paymentMethod; // UPI, CARD, NETBANKING, CASH
}

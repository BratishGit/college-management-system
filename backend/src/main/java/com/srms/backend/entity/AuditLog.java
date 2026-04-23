package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String action;

    @ManyToOne
    @JoinColumn(name = "performer_id")
    private User performer;

    @Column(length = 50)
    private String targetEntity;

    private Long entityId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

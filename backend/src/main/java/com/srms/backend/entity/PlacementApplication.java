package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "placement_applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(length = 20)
    @Builder.Default
    private String status = "APPLIED"; // APPLIED, SHORTLISTED, SELECTED, REJECTED

    @Builder.Default
    private LocalDateTime appliedAt = LocalDateTime.now();
}

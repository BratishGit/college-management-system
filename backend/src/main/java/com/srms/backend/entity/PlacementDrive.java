package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "placement_drives")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementDrive {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    private LocalDate driveDate;

    @Column(length = 100)
    private String jobRole;

    private Double packageLpa;

    private Double eligibilityCgpa;

    @Column(length = 20)
    @Builder.Default
    private String status = "UPCOMING"; // UPCOMING, ONGOING, COMPLETED
}

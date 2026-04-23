package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private Double internalMarks;
    private Double externalMarks;
    private Double totalMarks;

    @Column(length = 5)
    private String grade;

    private Double gradePoints;
    private Integer semester;

    @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
    @Builder.Default
    private Boolean isLocked = false;
}

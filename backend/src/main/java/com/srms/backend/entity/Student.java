package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_roll", columnList = "rollNumber"),
    @Index(name = "idx_student_dept", columnList = "department")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, nullable = false, length = 20)
    private String rollNumber;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(columnDefinition = "INT DEFAULT 1")
    private Integer currentSemester;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Teacher mentor;

    @Column(length = 20)
    private String residentialStatus; // HOSTEL, DAY_SCHOLAR

    @Column(length = 20)
    private String transportMode;

    @Column(length = 20, columnDefinition = "VARCHAR(20) DEFAULT 'ADMITTED'")
    @Builder.Default
    private String admissionStatus = "ADMITTED"; // APPLIED, ADMITTED, REJECTED, ALUMNI

    @ManyToOne
    @JoinColumn(name = "hostel_allocation_id")
    private HostelAllocation hostelAllocation;
}

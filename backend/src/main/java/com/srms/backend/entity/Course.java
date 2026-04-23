package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses", indexes = {
    @Index(name = "idx_course_code", columnList = "code")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer credits;

    @Column(nullable = false)
    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}

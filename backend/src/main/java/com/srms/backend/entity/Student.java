package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
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

    private String name;

    @Column(unique = true)
    private String rollNumber;

    private String department;
    private Integer currentSemester;

    @ManyToOne
    @JoinColumn(name = "mentor_id")
    private Teacher mentor;

    private String residentialStatus; // HOSTEL, DAY_SCHOLAR
    private String transportMode; // BUS, OWN_VEHICLE, NONE

    @ManyToOne
    @JoinColumn(name = "hostel_allocation_id")
    private HostelAllocation hostelAllocation;
}

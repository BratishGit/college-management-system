package com.srms.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "hostel_rooms")
public class HostelRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String hostelName;
    private String roomNumber;
    private String roomType; // SINGLE, DOUBLE, TRIPLE
    private Integer capacity;
    private Integer occupied;
    private String floor;
}

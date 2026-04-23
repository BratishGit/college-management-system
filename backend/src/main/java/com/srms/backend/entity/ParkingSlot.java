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
@Table(name = "parking_slots")
public class ParkingSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slotNumber;
    private String vehicleType; // TWO_WHEELER, FOUR_WHEELER
    private String status; // AVAILABLE, OCCUPIED

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}

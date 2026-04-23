package com.srms.backend.repository;

import com.srms.backend.entity.PlacementApplication;
import com.srms.backend.entity.PlacementDrive;
import com.srms.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlacementApplicationRepository extends JpaRepository<PlacementApplication, Long> {
    List<PlacementApplication> findByStudent(Student student);
    List<PlacementApplication> findByDrive(PlacementDrive drive);
    Optional<PlacementApplication> findByDriveAndStudent(PlacementDrive drive, Student student);
    long countByStatus(String status);
}

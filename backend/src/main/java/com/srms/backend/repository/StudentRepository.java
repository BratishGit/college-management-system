package com.srms.backend.repository;

import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByRollNumber(String rollNumber);
    Page<Student> findByDepartment(String department, Pageable pageable);
    Page<Student> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Student> findByAdmissionStatus(String status);
    List<Student> findByCurrentSemester(Integer currentSemester);
    long countByDepartment(String department);
    long countByAdmissionStatus(String status);
}

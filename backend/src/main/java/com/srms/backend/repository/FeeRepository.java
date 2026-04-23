package com.srms.backend.repository;

import com.srms.backend.entity.Fee;
import com.srms.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    List<Fee> findByStudent(Student student);
    List<Fee> findByStatus(String status);
    List<Fee> findByStudentAndSemester(Student student, Integer semester);
}

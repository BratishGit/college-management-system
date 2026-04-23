package com.srms.backend.repository;

import com.srms.backend.entity.Enrollment;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudent(Student student);
    List<Enrollment> findByCourse(Course course);
    Optional<Enrollment> findByStudentAndCourse(Student student, Course course);
    long countByCourse(Course course);
}

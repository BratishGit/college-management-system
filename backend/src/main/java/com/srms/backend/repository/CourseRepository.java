package com.srms.backend.repository;

import com.srms.backend.entity.Course;
import com.srms.backend.entity.Teacher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    List<Course> findByTeacher(Teacher teacher);
    List<Course> findBySemester(Integer semester);
    Page<Course> findByNameContainingIgnoreCase(String name, Pageable pageable);
}

package com.srms.backend.repository;

import com.srms.backend.entity.ExamSchedule;
import com.srms.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamScheduleRepository extends JpaRepository<ExamSchedule, Long> {
    List<ExamSchedule> findByCourse(Course course);
    List<ExamSchedule> findByCourseIn(List<Course> courses);
}

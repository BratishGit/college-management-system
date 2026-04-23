package com.srms.backend.repository;

import com.srms.backend.entity.Result;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudent(Student student);
    List<Result> findByCourse(Course course);
    Optional<Result> findByStudentAndCourse(Student student, Course course);

    @Query("SELECT AVG(r.gradePoints) FROM Result r WHERE r.student = ?1")
    Double findAverageGradePointsByStudent(Student student);

    @Query("SELECT AVG(r.totalMarks) FROM Result r WHERE r.course = ?1")
    Double findAverageMarksByCourse(Course course);

    @Query("SELECT r.course.id, r.course.name, r.course.code, AVG(r.totalMarks) FROM Result r GROUP BY r.course.id, r.course.name, r.course.code ORDER BY AVG(r.totalMarks) ASC")
    List<Object[]> findAverageMarksByCourseBatch();

    @Query("SELECT COUNT(r) FROM Result r WHERE r.grade != 'F'")
    long countPassResults();
}

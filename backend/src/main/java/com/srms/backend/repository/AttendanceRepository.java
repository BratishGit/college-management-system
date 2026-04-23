package com.srms.backend.repository;

import com.srms.backend.entity.Attendance;
import com.srms.backend.entity.Course;
import com.srms.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent(Student student);
    List<Attendance> findByCourse(Course course);
    List<Attendance> findByStudentAndCourse(Student student, Course course);
    List<Attendance> findByDateAndCourse(LocalDate date, Course course);
    Optional<Attendance> findByStudentAndCourseAndDate(Student student, Course course, LocalDate date);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = ?1 AND a.course = ?2 AND a.isPresent = true")
    long countPresentByStudentAndCourse(Student student, Course course);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = ?1 AND a.course = ?2")
    long countTotalByStudentAndCourse(Student student, Course course);
}

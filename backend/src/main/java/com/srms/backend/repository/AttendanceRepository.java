package com.srms.backend.repository;

import com.srms.backend.entity.Attendance;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent(Student student);

    List<Attendance> findBySubjectAndDate(Subject subject, LocalDate date);

    Optional<Attendance> findByStudentAndSubjectAndDate(Student student, Subject subject, LocalDate date);
}

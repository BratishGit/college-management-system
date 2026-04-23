package com.srms.backend.repository;

import com.srms.backend.entity.StudentReport;
import com.srms.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentReportRepository extends JpaRepository<StudentReport, Long> {
    List<StudentReport> findByStudent(Student student);
}

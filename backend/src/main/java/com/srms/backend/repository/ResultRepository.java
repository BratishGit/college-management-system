package com.srms.backend.repository;

import com.srms.backend.entity.Result;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudent(Student student);

    List<Result> findByStudentAndSemester(Student student, Integer semester);

    List<Result> findBySubject(Subject subject);

    Optional<Result> findByStudentAndSubject(Student student, Subject subject);
}

package com.srms.backend.repository;

import com.srms.backend.entity.Subject;
import com.srms.backend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByTeacher(Teacher teacher);

    List<Subject> findBySemester(Integer semester);
}

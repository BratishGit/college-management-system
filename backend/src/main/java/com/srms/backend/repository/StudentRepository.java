package com.srms.backend.repository;

import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);

    Optional<Student> findByRollNumber(String rollNumber);
}

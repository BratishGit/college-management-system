package com.srms.backend.config;

import com.srms.backend.entity.*;
import com.srms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ResultRepository resultRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create Admin
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);

            // Create Teacher
            User teacherUser = User.builder()
                    .username("teacher")
                    .password(passwordEncoder.encode("teacher123"))
                    .role(Role.TEACHER)
                    .build();
            userRepository.save(teacherUser);

            Teacher teacher = Teacher.builder()
                    .user(teacherUser)
                    .name("Dr. Smith")
                    .department("Computer Science")
                    .designation("Professor")
                    .build();
            teacherRepository.save(teacher);

            // Create Student
            User studentUser = User.builder()
                    .username("student")
                    .password(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .build();
            userRepository.save(studentUser);

            Student student = Student.builder()
                    .user(studentUser)
                    .name("John Doe")
                    .rollNumber("CS101")
                    .department("Computer Science")
                    .currentSemester(1)
                    .build();
            studentRepository.save(student);

            // Create Subjects
            Subject sub1 = Subject.builder()
                    .code("CS001")
                    .name("Data Structures")
                    .credits(4)
                    .semester(1)
                    .teacher(teacher)
                    .build();
            subjectRepository.save(sub1);

            Subject sub2 = Subject.builder()
                    .code("CS002")
                    .name("Java Programming")
                    .credits(3)
                    .semester(1)
                    .teacher(teacher)
                    .build();
            subjectRepository.save(sub2);

            // Create Initial Results
            Result res1 = Result.builder()
                    .student(student)
                    .subject(sub1)
                    .internalMarks(35.0)
                    .externalMarks(52.0)
                    .totalMarks(87.0)
                    .grade("A+")
                    .gradePoints(9.0)
                    .semester(1)
                    .isLocked(true)
                    .build();
            resultRepository.save(res1);

            Result res2 = Result.builder()
                    .student(student)
                    .subject(sub2)
                    .internalMarks(38.0)
                    .externalMarks(55.0)
                    .totalMarks(93.0)
                    .grade("O")
                    .gradePoints(10.0)
                    .semester(1)
                    .isLocked(true)
                    .build();
            resultRepository.save(res2);
        }
    }
}

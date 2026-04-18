package com.srms.backend.config;

import com.srms.backend.entity.*;
import com.srms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final StudentRepository studentRepository;
        private final TeacherRepository teacherRepository;
        private final SubjectRepository subjectRepository;
        private final ResultRepository resultRepository;
        private final AttendanceRepository attendanceRepository;
        private final LeaveRequestRepository leaveRequestRepository;
        private final ExamScheduleRepository examScheduleRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                if (userRepository.count() > 0)
                        return; // Already seeded

                // Create Admin
                User adminUser = User.builder()
                                .username("admin")
                                .password(passwordEncoder.encode("admin123"))
                                .role(Role.ADMIN)
                                .build();
                userRepository.save(adminUser);

                // Create Teachers
                User teacher1User = User.builder()
                                .username("teacher")
                                .password(passwordEncoder.encode("teacher123"))
                                .role(Role.TEACHER)
                                .build();
                userRepository.save(teacher1User);

                Teacher teacher1 = Teacher.builder()
                                .user(teacher1User)
                                .name("Dr. Sarah Johnson")
                                .department("Computer Science")
                                .designation("Associate Professor")
                                .build();
                teacherRepository.save(teacher1);

                User teacher2User = User.builder()
                                .username("prof.kumar")
                                .password(passwordEncoder.encode("kumar123"))
                                .role(Role.TEACHER)
                                .build();
                userRepository.save(teacher2User);

                Teacher teacher2 = Teacher.builder()
                                .user(teacher2User)
                                .name("Prof. Rajesh Kumar")
                                .department("Mathematics")
                                .designation("Professor")
                                .build();
                teacherRepository.save(teacher2);

                User teacher3User = User.builder()
                                .username("dr.patel")
                                .password(passwordEncoder.encode("patel123"))
                                .role(Role.TEACHER)
                                .build();
                userRepository.save(teacher3User);

                Teacher teacher3 = Teacher.builder()
                                .user(teacher3User)
                                .name("Dr. Priya Patel")
                                .department("Physics")
                                .designation("Assistant Professor")
                                .build();
                teacherRepository.save(teacher3);

                // Create Subjects
                Subject cs101 = Subject.builder()
                                .code("CS101")
                                .name("Data Structures & Algorithms")
                                .credits(4)
                                .semester(3)
                                .teacher(teacher1)
                                .build();
                subjectRepository.save(cs101);

                Subject cs102 = Subject.builder()
                                .code("CS102")
                                .name("Database Management Systems")
                                .credits(4)
                                .semester(3)
                                .teacher(teacher1)
                                .build();
                subjectRepository.save(cs102);

                Subject math201 = Subject.builder()
                                .code("MATH201")
                                .name("Discrete Mathematics")
                                .credits(3)
                                .semester(3)
                                .teacher(teacher2)
                                .build();
                subjectRepository.save(math201);

                Subject phy101 = Subject.builder()
                                .code("PHY101")
                                .name("Engineering Physics")
                                .credits(3)
                                .semester(3)
                                .teacher(teacher3)
                                .build();
                subjectRepository.save(phy101);

                // Create Students
                String[] studentNames = {
                                "Amit Sharma", "Priya Singh", "Rahul Verma", "Sneha Reddy",
                                "Karan Patel", "Anjali Gupta", "Vikram Rao", "Pooja Nair",
                                "Arjun Mehta", "Divya Iyer", "Rohan Das", "Kavya Pillai",
                                "Siddharth Joshi", "Meera Desai", "Aditya Kulkarni", "Riya Kapoor"
                };

                for (int i = 0; i < studentNames.length; i++) {
                        String rollNum = String.format("2024CS%03d", i + 1);
                        User studentUser = User.builder()
                                        .username(rollNum.toLowerCase())
                                        .password(passwordEncoder.encode("student123"))
                                        .role(Role.STUDENT)
                                        .build();
                        userRepository.save(studentUser);

                        // Assign mentor (distribute students among teachers)
                        Teacher mentor = i % 3 == 0 ? teacher1 : (i % 3 == 1 ? teacher2 : teacher3);

                        // Assign residential status (60% hostel, 40% day scholar)
                        String residentialStatus = i % 5 < 3 ? "HOSTEL" : "DAY_SCHOLAR";

                        // Assign transport mode
                        String transportMode;
                        if (residentialStatus.equals("HOSTEL")) {
                                transportMode = "NONE"; // Hostel students don't need transport
                        } else {
                                transportMode = i % 2 == 0 ? "BUS" : "OWN_VEHICLE";
                        }

                        Student student = Student.builder()
                                        .user(studentUser)
                                        .name(studentNames[i])
                                        .rollNumber(rollNum)
                                        .department("Computer Science")
                                        .currentSemester(3)
                                        .mentor(mentor)
                                        .residentialStatus(residentialStatus)
                                        .transportMode(transportMode)
                                        .build();
                        studentRepository.save(student);

                        // Add Results
                        createResult(student, cs101, 35.0, 52.0);
                        createResult(student, cs102, 38.0, 55.0);
                        createResult(student, math201, 32.0, 48.0);
                        createResult(student, phy101, 36.0, 50.0);

                        // Add Attendance (last 20 days)
                        for (int day = 0; day < 20; day++) {
                                LocalDate date = LocalDate.now().minusDays(day);
                                createAttendance(student, cs101, date, Math.random() > 0.2);
                                createAttendance(student, cs102, date, Math.random() > 0.25);
                                createAttendance(student, math201, date, Math.random() > 0.15);
                                createAttendance(student, phy101, date, Math.random() > 0.3);
                        }

                        // Add some leave requests
                        if (i % 4 == 0) {
                                LeaveRequest leave = LeaveRequest.builder()
                                                .user(studentUser)
                                                .reason("Medical emergency - Fever")
                                                .startDate(LocalDate.now().minusDays(5))
                                                .endDate(LocalDate.now().minusDays(3))
                                                .status(i % 2 == 0 ? "APPROVED" : "PENDING")
                                                .type("MEDICAL")
                                                .build();
                                leaveRequestRepository.save(leave);
                        }
                }

                // Add Exam Schedules
                ExamSchedule exam1 = ExamSchedule.builder()
                                .subject(cs101)
                                .examDate(LocalDateTime.now().plusDays(15).withHour(10).withMinute(0))
                                .room("LAB 401")
                                .durationMinutes(180)
                                .build();
                examScheduleRepository.save(exam1);

                ExamSchedule exam2 = ExamSchedule.builder()
                                .subject(cs102)
                                .examDate(LocalDateTime.now().plusDays(17).withHour(14).withMinute(0))
                                .room("HALL B")
                                .durationMinutes(180)
                                .build();
                examScheduleRepository.save(exam2);

                ExamSchedule exam3 = ExamSchedule.builder()
                                .subject(math201)
                                .examDate(LocalDateTime.now().plusDays(20).withHour(10).withMinute(0))
                                .room("ROOM 305")
                                .durationMinutes(180)
                                .build();
                examScheduleRepository.save(exam3);

                ExamSchedule exam4 = ExamSchedule.builder()
                                .subject(phy101)
                                .examDate(LocalDateTime.now().plusDays(22).withHour(14).withMinute(0))
                                .room("LAB 201")
                                .durationMinutes(180)
                                .build();
                examScheduleRepository.save(exam4);

                System.out.println("✅ Database seeded with sample data!");
                System.out.println("📚 Created: 16 Students, 3 Teachers, 4 Subjects");
                System.out.println("🔐 Login Credentials:");
                System.out.println("   Admin: admin / admin123");
                System.out.println("   Teacher: teacher / teacher123");
                System.out.println("   Student: 2024cs001 / student123 (or any roll number)");
        }

        private void createResult(Student student, Subject subject, Double internal, Double external) {
                Double total = internal + external;
                String grade = calculateGrade(total);
                Double gradePoints = calculateGradePoints(grade);

                Result result = Result.builder()
                                .student(student)
                                .subject(subject)
                                .internalMarks(internal)
                                .externalMarks(external)
                                .totalMarks(total)
                                .grade(grade)
                                .gradePoints(gradePoints)
                                .semester(subject.getSemester())
                                .isLocked(true)
                                .build();
                resultRepository.save(result);
        }

        private void createAttendance(Student student, Subject subject, LocalDate date, boolean present) {
                Attendance attendance = Attendance.builder()
                                .student(student)
                                .subject(subject)
                                .date(date)
                                .isPresent(present)
                                .build();
                attendanceRepository.save(attendance);
        }

        private String calculateGrade(Double totalMarks) {
                if (totalMarks >= 90)
                        return "O";
                if (totalMarks >= 80)
                        return "A+";
                if (totalMarks >= 70)
                        return "A";
                if (totalMarks >= 60)
                        return "B";
                if (totalMarks >= 50)
                        return "C";
                return "F";
        }

        private Double calculateGradePoints(String grade) {
                return switch (grade) {
                        case "O" -> 10.0;
                        case "A+" -> 9.0;
                        case "A" -> 8.0;
                        case "B" -> 7.0;
                        case "C" -> 6.0;
                        default -> 0.0;
                };
        }
}

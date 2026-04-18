package com.srms.backend.controller;

import com.srms.backend.entity.*;
import com.srms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final LeaveRequestRepository leaveRequestRepository;
    private final ExamScheduleRepository examScheduleRepository;
    private final AttendanceRepository attendanceRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalTeachers", teacherRepository.count());
        stats.put("totalSubjects", subjectRepository.count());

        long totalResults = resultRepository.count();
        long passCount = resultRepository.findAll().stream()
                .filter(r -> !r.getGrade().equals("F")).count();

        stats.put("passRate", totalResults == 0 ? 0 : (double) passCount / totalResults * 100);
        return stats;
    }

    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @GetMapping("/teachers")
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @GetMapping("/subjects")
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @GetMapping("/leaves")
    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    @PutMapping("/leaves/{id}")
    public LeaveRequest updateLeaveStatus(@PathVariable Long id, @RequestParam String status) {
        LeaveRequest leave = leaveRequestRepository.findById(id).orElseThrow();
        leave.setStatus(status);
        return leaveRequestRepository.save(leave);
    }

    @PostMapping("/exams")
    public ExamSchedule createExamSchedule(@RequestBody ExamSchedule schedule) {
        return examScheduleRepository.save(schedule);
    }

    @GetMapping("/exams")
    public List<ExamSchedule> getAllExams() {
        return examScheduleRepository.findAll();
    }

    @PostMapping("/students")
    public Student createStudent(@RequestBody Map<String, String> data) {
        User user = User.builder()
                .username(data.get("username"))
                .password(passwordEncoder.encode(data.get("password")))
                .role(Role.STUDENT)
                .build();
        userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .name(data.get("name"))
                .rollNumber(data.get("rollNumber"))
                .department(data.get("department"))
                .currentSemester(Integer.parseInt(data.get("currentSemester")))
                .build();
        return studentRepository.save(student);
    }

    @PostMapping("/teachers")
    public Teacher createTeacher(@RequestBody Map<String, String> data) {
        User user = User.builder()
                .username(data.get("username"))
                .password(passwordEncoder.encode(data.get("password")))
                .role(Role.TEACHER)
                .build();
        userRepository.save(user);

        Teacher teacher = Teacher.builder()
                .user(user)
                .name(data.get("name"))
                .department(data.get("department"))
                .designation(data.get("designation"))
                .build();
        return teacherRepository.save(teacher);
    }

    @PutMapping("/teachers/{id}")
    public Teacher updateTeacher(@PathVariable Long id, @RequestBody Map<String, String> data) {
        Teacher teacher = teacherRepository.findById(id).orElseThrow();
        teacher.setName(data.get("name"));
        teacher.setDepartment(data.get("department"));
        teacher.setDesignation(data.get("designation"));
        return teacherRepository.save(teacher);
    }

    @PostMapping("/subjects")
    public Subject createSubject(@RequestBody Map<String, String> data) {
        Teacher teacher = teacherRepository.findById(Long.parseLong(data.get("teacherId"))).orElseThrow();
        Subject subject = Subject.builder()
                .code(data.get("code"))
                .name(data.get("name"))
                .credits(Integer.parseInt(data.get("credits")))
                .semester(Integer.parseInt(data.get("semester")))
                .teacher(teacher)
                .build();
        return subjectRepository.save(subject);
    }
}

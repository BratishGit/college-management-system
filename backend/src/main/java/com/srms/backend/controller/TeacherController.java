package com.srms.backend.controller;

import com.srms.backend.entity.*;
import com.srms.backend.repository.*;
import com.srms.backend.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasRole('TEACHER')")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;
    private final ResultService resultService;
    private final AttendanceRepository attendanceRepository;
    private final StudentReportRepository studentReportRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Teacher teacher = teacherRepository.findAll().stream()
                .filter(t -> t.getUser().getUsername().equals(username))
                .findFirst().orElseThrow();

        List<Subject> mySubjects = subjectRepository.findByTeacher(teacher);
        List<LeaveRequest> myLeaves = leaveRequestRepository.findByUser(teacher.getUser());
        List<StudentReport> reports = studentReportRepository.findAll().stream()
                .filter(r -> r.getTeacher().getId().equals(teacher.getId()))
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("teacher", teacher);
        response.put("subjects", mySubjects);
        response.put("leaves", myLeaves);
        response.put("reports", reports);
        return response;
    }

    @PostMapping("/attendance")
    public List<Attendance> markAttendance(@RequestBody List<Attendance> attendanceList) {
        return attendanceRepository.saveAll(attendanceList);
    }

    @PostMapping("/reports")
    public StudentReport reportStudent(@RequestBody StudentReport report) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Teacher teacher = teacherRepository.findAll().stream()
                .filter(t -> t.getUser().getUsername().equals(username))
                .findFirst().orElseThrow();

        report.setTeacher(teacher);
        report.setReportedAt(java.time.LocalDateTime.now());
        report.setStatus("PENDING");
        return studentReportRepository.save(report);
    }

    @PostMapping("/leaves")
    public LeaveRequest applyLeave(@RequestBody LeaveRequest leaveRequest) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = teacherRepository.findAll().stream()
                .filter(t -> t.getUser().getUsername().equals(username))
                .findFirst().orElseThrow().getUser();

        leaveRequest.setUser(user);
        leaveRequest.setStatus("PENDING");
        return leaveRequestRepository.save(leaveRequest);
    }

    @GetMapping("/subjects")
    public List<Subject> getMySubjects() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Teacher teacher = teacherRepository.findAll().stream()
                .filter(t -> t.getUser().getUsername().equals(username))
                .findFirst().orElseThrow();
        return subjectRepository.findByTeacher(teacher);
    }

    @GetMapping("/students/{semester}")
    public List<Student> getStudentsInSemester(@PathVariable Integer semester) {
        return studentRepository.findAll().stream()
                .filter(s -> s.getCurrentSemester().equals(semester))
                .toList();
    }

    @PostMapping("/marks")
    public ResponseEntity<?> submitMarks(@RequestParam String rollNumber,
            @RequestParam Long subjectId,
            @RequestParam Double internal,
            @RequestParam Double external) {
        Student student = studentRepository.findByRollNumber(rollNumber).orElseThrow();
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();

        Double total = internal + external;
        String grade = resultService.calculateGrade(total);
        Double gradePoints = resultService.calculateGradePoints(grade);

        Result result = resultRepository.findByStudentAndSubject(student, subject)
                .orElse(new Result());

        if (Boolean.TRUE.equals(result.getIsLocked())) {
            return ResponseEntity.badRequest().body("Result is locked and cannot be edited.");
        }

        result.setStudent(student);
        result.setSubject(subject);
        result.setInternalMarks(internal);
        result.setExternalMarks(external);
        result.setTotalMarks(total);
        result.setGrade(grade);
        result.setGradePoints(gradePoints);
        result.setSemester(subject.getSemester());
        result.setIsLocked(false);

        resultRepository.save(result);
        return ResponseEntity.ok("Marks submitted successfully");
    }

    @PostMapping("/marks/lock")
    public ResponseEntity<?> lockMarks(@RequestParam String rollNumber, @RequestParam Long subjectId) {
        Student student = studentRepository.findByRollNumber(rollNumber).orElseThrow();
        Subject subject = subjectRepository.findById(subjectId).orElseThrow();
        Result result = resultRepository.findByStudentAndSubject(student, subject).orElseThrow();
        result.setIsLocked(true);
        resultRepository.save(result);
        return ResponseEntity.ok("Marks locked successfully");
    }
}

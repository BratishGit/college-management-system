package com.srms.backend.controller;

import com.srms.backend.entity.*;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.*;
import com.srms.backend.service.AttendanceService;
import com.srms.backend.service.ResultService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TEACHER')")
public class TeacherPortalController {

    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final AttendanceService attendanceService;
    private final ResultService resultService;
    private final ResultRepository resultRepository;

    /**
     * GET /api/teacher/subjects - Returns courses assigned to the authenticated teacher.
     * Used by TeacherAttendance.jsx and TeacherMarksEntry.jsx
     */
    @GetMapping("/subjects")
    public ResponseEntity<List<Course>> getTeacherSubjects(@AuthenticationPrincipal User user) {
        Teacher teacher = teacherRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "userId", user.getId()));
        return ResponseEntity.ok(courseRepository.findByTeacher(teacher));
    }

    /**
     * GET /api/teacher/students/{semester} - Returns students in the given semester.
     * Used by TeacherAttendance.jsx for class-specific student lists
     */
    @GetMapping("/students/{semester}")
    public ResponseEntity<List<Student>> getStudentsBySemester(@PathVariable Integer semester) {
        return ResponseEntity.ok(studentRepository.findByCurrentSemester(semester));
    }

    /**
     * POST /api/teacher/attendance - Bulk save attendance records.
     * Used by TeacherAttendance.jsx when teacher submits class attendance
     */
    @PostMapping("/attendance")
    public ResponseEntity<Map<String, Object>> markAttendance(
            @RequestBody List<AttendanceRecord> records,
            @AuthenticationPrincipal User user) {
        int saved = 0;
        for (AttendanceRecord record : records) {
            attendanceService.markAttendance(
                    record.getStudentId(),
                    record.getCourseId(),
                    LocalDate.parse(record.getDate()),
                    record.getIsPresent()
            );
            saved++;
        }
        Map<String, Object> response = new HashMap<>();
        response.put("saved", saved);
        response.put("message", "Attendance submitted successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/teacher/marks - Save or update marks for a student.
     * Used by TeacherMarksEntry.jsx
     */
    @PostMapping("/marks")
    public ResponseEntity<Result> saveMarks(
            @RequestParam String rollNumber,
            @RequestParam Long subjectId,
            @RequestParam Double internal,
            @RequestParam Double external,
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "rollNumber", rollNumber));
        return ResponseEntity.ok(resultService.saveOrUpdateResult(
                student.getId(), subjectId, internal, external, user));
    }

    /**
     * POST /api/teacher/marks/lock - Lock a result to prevent further edits.
     * Used by TeacherMarksEntry.jsx lock button
     */
    @PostMapping("/marks/lock")
    public ResponseEntity<Map<String, Object>> lockMarks(
            @RequestParam String rollNumber,
            @RequestParam Long subjectId,
            @AuthenticationPrincipal User user) {
        Student student = studentRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "rollNumber", rollNumber));
        Course course = courseRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", subjectId));
        resultService.lockResult(student, course, user);

        Map<String, Object> response = new HashMap<>();
        response.put("locked", true);
        response.put("message", "Result locked successfully");
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/teacher/dashboard - Returns teacher dashboard data.
     * Used by TeacherDashboard.jsx
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getTeacherDashboard(@AuthenticationPrincipal User user) {
        Teacher teacher = teacherRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", "userId", user.getId()));

        List<Course> courses = courseRepository.findByTeacher(teacher);
        long totalStudents = studentRepository.count();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("teacher", teacher);
        dashboard.put("courses", courses);
        dashboard.put("totalCourses", courses.size());
        dashboard.put("totalStudents", totalStudents);

        return ResponseEntity.ok(dashboard);
    }

    @Data
    public static class AttendanceRecord {
        private Long studentId;
        private Long courseId;
        private String date;
        private Boolean isPresent;
    }
}

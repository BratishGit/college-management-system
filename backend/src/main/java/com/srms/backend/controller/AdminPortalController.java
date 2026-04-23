package com.srms.backend.controller;

import com.srms.backend.entity.Attendance;
import com.srms.backend.entity.ExamSchedule;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import com.srms.backend.repository.AttendanceRepository;
import com.srms.backend.repository.ExamScheduleRepository;
import com.srms.backend.repository.StudentRepository;
import com.srms.backend.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPortalController {

    private final ExamScheduleRepository examScheduleRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final AuditLogService auditLogService;

    /**
     * GET /api/admin/exams - Returns all exam schedules.
     * Used by ExamPage.jsx for admin view
     */
    @GetMapping("/exams")
    public ResponseEntity<List<ExamSchedule>> getAllExams() {
        return ResponseEntity.ok(examScheduleRepository.findAll());
    }

    /**
     * POST /api/admin/exams - Create a new exam schedule.
     * Used by ExamPage.jsx admin modal
     */
    @PostMapping("/exams")
    public ResponseEntity<ExamSchedule> createExam(
            @RequestBody ExamSchedule examSchedule,
            @AuthenticationPrincipal User adminUser) {
        ExamSchedule saved = examScheduleRepository.save(examSchedule);
        auditLogService.logAction("CREATE_EXAM", adminUser, "EXAM_SCHEDULE", saved.getId(),
                "Created exam for course: " + saved.getCourse().getCode());
        return ResponseEntity.ok(saved);
    }

    /**
     * GET /api/admin/attendance - Returns all attendance records.
     * Used by AttendancePage.jsx for admin table view
     */
    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    /**
     * GET /api/admin/students - Returns all students (non-paginated).
     * Used by ReportPage.jsx for student selector dropdown
     */
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }
}

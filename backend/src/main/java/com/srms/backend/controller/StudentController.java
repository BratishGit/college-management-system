package com.srms.backend.controller;

import com.srms.backend.entity.*;
import com.srms.backend.repository.*;
import com.srms.backend.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentController {

        private final StudentRepository studentRepository;
        private final ResultRepository resultRepository;
        private final ResultService resultService;
        private final AttendanceRepository attendanceRepository;
        private final LeaveRequestRepository leaveRequestRepository;
        private final ExamScheduleRepository examScheduleRepository;
        private final SubjectRepository subjectRepository;
        private final StudentReportRepository studentReportRepository;

        @GetMapping("/dashboard")
        public Map<String, Object> getDashboardData() {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                Student student = studentRepository.findAll().stream()
                                .filter(s -> s.getUser().getUsername().equals(username))
                                .findFirst().orElseThrow();

                List<Result> results = resultRepository.findByStudent(student);
                Double sgpa = resultService.calculateSGPA(results);
                List<Attendance> attendance = attendanceRepository.findByStudent(student);
                List<LeaveRequest> leaves = leaveRequestRepository.findByUser(student.getUser());
                List<Subject> mySubjects = subjectRepository.findAll().stream()
                                .filter(sub -> sub.getSemester().equals(student.getCurrentSemester()))
                                .toList();

                List<ExamSchedule> examSchedules = mySubjects.stream()
                                .flatMap(sub -> examScheduleRepository.findBySubject(sub).stream())
                                .toList();

                List<StudentReport> myReports = studentReportRepository.findByStudent(student);

                Map<String, Object> response = new HashMap<>();
                response.put("student", student);
                response.put("results", results);
                response.put("sgpa", sgpa);
                response.put("attendance", attendance);
                response.put("leaves", leaves);
                response.put("examSchedules", examSchedules);
                response.put("subjects", mySubjects);
                response.put("reports", myReports);
                return response;
        }

        @PostMapping("/leaves")
        public LeaveRequest applyLeave(@RequestBody LeaveRequest leaveRequest) {
                String username = SecurityContextHolder.getContext().getAuthentication().getName();
                User user = studentRepository.findAll().stream()
                                .filter(s -> s.getUser().getUsername().equals(username))
                                .findFirst().orElseThrow().getUser();

                leaveRequest.setUser(user);
                leaveRequest.setStatus("PENDING");
                return leaveRequestRepository.save(leaveRequest);
        }
}

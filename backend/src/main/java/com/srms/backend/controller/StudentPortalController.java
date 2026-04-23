package com.srms.backend.controller;

import com.srms.backend.dto.response.StudentResponse;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import com.srms.backend.service.StudentPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentPortalController {
    private final StudentPortalService studentPortalService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, Object>> getStudentDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(studentPortalService.getStudentDashboard(user));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentResponse> getStudentProfile(@AuthenticationPrincipal User user) {
        Student student = studentPortalService.getStudentProfile(user);
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setName(student.getName());
        response.setRollNumber(student.getRollNumber());
        response.setDepartment(student.getDepartment());
        response.setCurrentSemester(student.getCurrentSemester());
        response.setAdmissionStatus(student.getAdmissionStatus());
        return ResponseEntity.ok(response);
    }
}


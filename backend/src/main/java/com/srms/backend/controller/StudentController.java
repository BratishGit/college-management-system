package com.srms.backend.controller;

import com.srms.backend.dto.request.StudentRegistrationRequest;
import com.srms.backend.dto.request.StudentUpdateRequest;
import com.srms.backend.dto.response.StudentResponse;
import com.srms.backend.entity.User;
import com.srms.backend.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> registerStudent(
            @Valid @RequestBody StudentRegistrationRequest request,
            @AuthenticationPrincipal User adminUser) {
        return ResponseEntity.ok(studentService.registerStudent(request, adminUser));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Page<StudentResponse>> getAllStudents(Pageable pageable) {
        return ResponseEntity.ok(studentService.getAllStudents(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or (hasRole('STUDENT') and principal.id == #id)")
    public ResponseEntity<StudentResponse> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Page<StudentResponse>> searchStudents(
            @RequestParam String name,
            Pageable pageable) {
        return ResponseEntity.ok(studentService.searchStudents(name, pageable));
    }

    @PatchMapping("/{id}/admission")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateAdmissionStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal User adminUser) {
        studentService.updateAdmissionStatus(id, status, adminUser);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponse> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentUpdateRequest request,
            @AuthenticationPrincipal User adminUser) {
        return ResponseEntity.ok(studentService.updateStudent(id, request, adminUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id,
            @AuthenticationPrincipal User adminUser) {
        studentService.deleteStudent(id, adminUser);
        return ResponseEntity.noContent().build();
    }
}

package com.srms.backend.service;

import com.srms.backend.dto.request.StudentRegistrationRequest;
import com.srms.backend.dto.request.StudentUpdateRequest;
import com.srms.backend.dto.response.StudentResponse;
import com.srms.backend.entity.Role;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.StudentRepository;
import com.srms.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    @Transactional
    public StudentResponse registerStudent(StudentRegistrationRequest request, User performer) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        if (studentRepository.findByRollNumber(request.getRollNumber()).isPresent()) {
            throw new IllegalArgumentException("Roll number is already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .build();
        user = userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .name(request.getName())
                .department(request.getDepartment())
                .rollNumber(request.getRollNumber())
                // BIZ-07: Use frontend-provided values with sensible defaults
                .admissionStatus(request.getAdmissionStatus() != null ? request.getAdmissionStatus() : "APPLIED")
                .currentSemester(request.getCurrentSemester() != null ? request.getCurrentSemester() : 1)
                .build();
        student = studentRepository.save(student);

        if (performer != null) {
            auditLogService.logAction("REGISTER_STUDENT", performer, "STUDENT", student.getId(), "Student registered: " + student.getRollNumber());
        }

        return mapToResponse(student);
    }

    public Page<StudentResponse> getAllStudents(Pageable pageable) {
        return studentRepository.findAll(pageable).map(this::mapToResponse);
    }

    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        return mapToResponse(student);
    }
    
    public Page<StudentResponse> searchStudents(String name, Pageable pageable) {
        return studentRepository.findByNameContainingIgnoreCase(name, pageable).map(this::mapToResponse);
    }

    @Transactional
    public void updateAdmissionStatus(Long id, String status, User adminUser) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));
        
        String oldStatus = student.getAdmissionStatus();
        student.setAdmissionStatus(status);
        studentRepository.save(student);

        auditLogService.logAction("UPDATE_ADMISSION_STATUS", adminUser, "STUDENT", student.getId(), 
            "Status changed from " + oldStatus + " to " + status);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request, User adminUser) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        student.setName(request.getName());
        student.setDepartment(request.getDepartment());
        
        if (request.getCurrentSemester() != null) {
            student.setCurrentSemester(request.getCurrentSemester());
        }
        if (request.getAdmissionStatus() != null) {
            student.setAdmissionStatus(request.getAdmissionStatus());
        }
        
        student = studentRepository.save(student);

        if (adminUser != null) {
            auditLogService.logAction("UPDATE_STUDENT", adminUser, "STUDENT", student.getId(), "Student updated: " + student.getRollNumber());
        }

        return mapToResponse(student);
    }

    @Transactional
    public void deleteStudent(Long id, User adminUser) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", id));

        User studentUser = student.getUser();
        // BIZ-06: Delete student first, then associated user to prevent orphans
        studentRepository.delete(student);
        if (studentUser != null) {
            userRepository.delete(studentUser);
        }

        if (adminUser != null) {
            auditLogService.logAction("DELETE_STUDENT", adminUser, "STUDENT", id, "Student deleted: " + student.getRollNumber());
        }
    }

    private StudentResponse mapToResponse(Student student) {
        StudentResponse response = new StudentResponse();
        response.setId(student.getId());
        response.setName(student.getName());
        response.setRollNumber(student.getRollNumber());
        response.setDepartment(student.getDepartment());
        response.setCurrentSemester(student.getCurrentSemester());
        response.setAdmissionStatus(student.getAdmissionStatus());
        return response;
    }
}

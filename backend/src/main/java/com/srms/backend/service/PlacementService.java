package com.srms.backend.service;

import com.srms.backend.entity.Company;
import com.srms.backend.entity.PlacementApplication;
import com.srms.backend.entity.PlacementDrive;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.CompanyRepository;
import com.srms.backend.repository.PlacementApplicationRepository;
import com.srms.backend.repository.PlacementDriveRepository;
import com.srms.backend.repository.ResultRepository;
import com.srms.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlacementService {

    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final PlacementApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;
    private final AuditLogService auditLogService;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<PlacementDrive> getActiveDrives() {
        return driveRepository.findByStatus("UPCOMING");
    }

    @Transactional
    public PlacementApplication applyForDrive(Long driveId, Long studentId, User studentUser) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        if (!student.getUser().getId().equals(studentUser.getId())) {
            throw new IllegalArgumentException("Cannot apply on behalf of another student");
        }

        // BIZ-10: Check for duplicate application
        Optional<PlacementApplication> existingApp = applicationRepository.findByDriveAndStudent(drive, student);
        if (existingApp.isPresent()) {
            throw new IllegalArgumentException("You have already applied for this drive");
        }

        // BIZ-09: Check CGPA eligibility
        if (drive.getEligibilityCgpa() != null) {
            Double studentCgpa = resultRepository.findAverageGradePointsByStudent(student);
            if (studentCgpa == null || studentCgpa < drive.getEligibilityCgpa()) {
                throw new IllegalArgumentException("Student does not meet the minimum CGPA requirement of " + drive.getEligibilityCgpa());
            }
        }

        PlacementApplication application = PlacementApplication.builder()
                .drive(drive)
                .student(student)
                .status("APPLIED")
                .build();
        
        application = applicationRepository.save(application);

        auditLogService.logAction("PLACEMENT_APPLICATION", studentUser, "PLACEMENT_APPLICATION", application.getId(), 
            "Student applied for company: " + drive.getCompany().getName());

        return application;
    }

    @Transactional
    public void updateApplicationStatus(Long applicationId, String status, User adminUser) {
        PlacementApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementApplication", "id", applicationId));
        
        application.setStatus(status);
        applicationRepository.save(application);

        auditLogService.logAction("UPDATE_PLACEMENT_STATUS", adminUser, "PLACEMENT_APPLICATION", application.getId(), 
            "Status updated to: " + status);
    }
}

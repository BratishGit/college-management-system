package com.srms.backend.service;

import com.srms.backend.entity.Course;
import com.srms.backend.entity.Result;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.exception.UnauthorizedActionException;
import com.srms.backend.repository.CourseRepository;
import com.srms.backend.repository.ResultRepository;
import com.srms.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public Result saveOrUpdateResult(Long studentId, Long courseId, Double internalMarks, Double externalMarks, User teacherUser) {
        // BIZ-01: Server-side marks validation
        if (internalMarks == null || internalMarks < 0 || internalMarks > 40) {
            throw new IllegalArgumentException("Internal marks must be between 0 and 40");
        }
        if (externalMarks == null || externalMarks < 0 || externalMarks > 60) {
            throw new IllegalArgumentException("External marks must be between 0 and 60");
        }

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        Optional<Result> existingResultOpt = resultRepository.findByStudentAndCourse(student, course);
        
        if (existingResultOpt.isPresent() && existingResultOpt.get().getIsLocked()) {
            throw new UnauthorizedActionException("This result is locked and cannot be modified.");
        }

        Result result = existingResultOpt.orElse(new Result());
        result.setStudent(student);
        result.setCourse(course);
        result.setInternalMarks(internalMarks);
        result.setExternalMarks(externalMarks);
        
        Double total = internalMarks + externalMarks;
        result.setTotalMarks(total);
        result.setSemester(course.getSemester());
        
        // Basic Grading Logic
        if (total >= 90) { result.setGrade("A+"); result.setGradePoints(10.0); }
        else if (total >= 80) { result.setGrade("A"); result.setGradePoints(9.0); }
        else if (total >= 70) { result.setGrade("B"); result.setGradePoints(8.0); }
        else if (total >= 60) { result.setGrade("C"); result.setGradePoints(7.0); }
        else if (total >= 50) { result.setGrade("D"); result.setGradePoints(6.0); }
        else { result.setGrade("F"); result.setGradePoints(0.0); }

        result = resultRepository.save(result);

        auditLogService.logAction("UPDATE_RESULT", teacherUser, "RESULT", result.getId(), 
            "Marks updated for student " + student.getRollNumber() + " course " + course.getCode());

        return result;
    }

    /**
     * BIZ-02/API-07: Lock a result to prevent further modifications.
     */
    @Transactional
    public void lockResult(Student student, Course course, User teacherUser) {
        Result result = resultRepository.findByStudentAndCourse(student, course)
                .orElseThrow(() -> new ResourceNotFoundException("Result", "student+course", 
                    student.getRollNumber() + "+" + course.getCode()));
        
        if (result.getIsLocked()) {
            throw new IllegalArgumentException("Result is already locked");
        }

        result.setIsLocked(true);
        resultRepository.save(result);

        auditLogService.logAction("LOCK_RESULT", teacherUser, "RESULT", result.getId(),
            "Locked result for " + student.getRollNumber() + " in " + course.getCode());
    }

    public List<Result> getResultsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        return resultRepository.findByStudent(student);
    }
}

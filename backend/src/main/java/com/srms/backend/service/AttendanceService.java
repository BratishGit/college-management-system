package com.srms.backend.service;

import com.srms.backend.entity.Attendance;
import com.srms.backend.entity.Course;
import com.srms.backend.entity.Student;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.AttendanceRepository;
import com.srms.backend.repository.CourseRepository;
import com.srms.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public void markAttendance(Long courseId, LocalDate date, Map<Long, Boolean> studentAttendanceMap) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        for (Map.Entry<Long, Boolean> entry : studentAttendanceMap.entrySet()) {
            Student student = studentRepository.findById(entry.getKey())
                    .orElseThrow(() -> new ResourceNotFoundException("Student", "id", entry.getKey()));

            // BIZ-08: Upsert — prevent duplicate attendance for same student-course-date
            Attendance existing = attendanceRepository.findByStudentAndCourseAndDate(student, course, date)
                    .orElse(null);

            if (existing != null) {
                existing.setIsPresent(entry.getValue());
                attendanceRepository.save(existing);
            } else {
                Attendance attendance = Attendance.builder()
                        .student(student)
                        .course(course)
                        .date(date)
                        .isPresent(entry.getValue())
                        .build();
                attendanceRepository.save(attendance);
            }
        }
    }

    /**
     * Single-student attendance mark — used by TeacherPortalController.
     */
    @Transactional
    public void markAttendance(Long studentId, Long courseId, LocalDate date, Boolean isPresent) {
        Map<Long, Boolean> map = new HashMap<>();
        map.put(studentId, isPresent);
        markAttendance(courseId, date, map);
    }

    public Map<String, Object> getStudentAttendanceStats(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        long totalClasses = attendanceRepository.countTotalByStudentAndCourse(student, course);
        long presentClasses = attendanceRepository.countPresentByStudentAndCourse(student, course);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClasses", totalClasses);
        stats.put("presentClasses", presentClasses);
        
        double percentage = totalClasses == 0 ? 0.0 : ((double) presentClasses / totalClasses) * 100;
        stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
        
        return stats;
    }
}

package com.srms.backend.service;

import com.srms.backend.entity.*;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentPortalService {
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final CourseRepository courseRepository;
    private final ResultRepository resultRepository;
    private final ExamScheduleRepository examScheduleRepository;

    public Map<String, Object> getStudentDashboard(User user) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "username", user.getUsername()));

        List<Course> enrolledCourses = courseRepository.findBySemester(student.getCurrentSemester());
        List<Attendance> attendanceRecords = attendanceRepository.findByStudent(student);
        List<Result> results = resultRepository.findByStudent(student);
        List<ExamSchedule> examSchedules = examScheduleRepository.findByCourseIn(enrolledCourses);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("student", student);
        dashboard.put("subjects", enrolledCourses);
        dashboard.put("attendance", attendanceRecords);
        dashboard.put("results", results);
        dashboard.put("examSchedules", examSchedules);

        return dashboard;
    }

    public Student getStudentProfile(User user) {
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "username", user.getUsername()));
    }
}

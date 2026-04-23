package com.srms.backend.service;

import com.srms.backend.dto.request.CourseRequest;
import com.srms.backend.dto.response.CourseResponse;
import com.srms.backend.entity.Course;
import com.srms.backend.entity.Teacher;
import com.srms.backend.entity.User;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.CourseRepository;
import com.srms.backend.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public CourseResponse createCourse(CourseRequest request, User adminUser) {
        if (courseRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Course code already exists");
        }

        Course course = Course.builder()
                .code(request.getCode())
                .name(request.getName())
                .credits(request.getCredits())
                .semester(request.getSemester())
                .build();

        if (request.getTeacherId() != null) {
            Teacher teacher = teacherRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", "id", request.getTeacherId()));
            course.setTeacher(teacher);
        }

        course = courseRepository.save(course);

        auditLogService.logAction("CREATE_COURSE", adminUser, "COURSE", course.getId(), "Created course: " + course.getCode());

        return mapToResponse(course);
    }

    public Page<CourseResponse> getAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable).map(this::mapToResponse);
    }

    public Page<CourseResponse> searchCourses(String name, Pageable pageable) {
        return courseRepository.findByNameContainingIgnoreCase(name, pageable).map(this::mapToResponse);
    }

    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return mapToResponse(course);
    }

    private CourseResponse mapToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setCode(course.getCode());
        response.setName(course.getName());
        response.setCredits(course.getCredits());
        response.setSemester(course.getSemester());
        if (course.getTeacher() != null) {
            response.setTeacherName(course.getTeacher().getName());
        }
        return response;
    }
}

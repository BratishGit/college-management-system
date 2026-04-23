package com.srms.backend.service;

import com.srms.backend.entity.Course;
import com.srms.backend.entity.Timetable;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.CourseRepository;
import com.srms.backend.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final CourseRepository courseRepository;

    public List<Timetable> getTimetableByCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));
        return timetableRepository.findByCourse(course);
    }
    
    public List<Timetable> getTimetableBySemester(Integer semester) {
        return timetableRepository.findByCourseSemester(semester);
    }
}

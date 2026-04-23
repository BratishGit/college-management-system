package com.srms.backend.service;

import com.srms.backend.repository.CourseRepository;
import com.srms.backend.repository.StudentRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GlobalSearchService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;


    public Map<String, Object> searchAll(String query) {
        Map<String, Object> results = new HashMap<>();

        if (query == null || query.trim().isEmpty()) {
            return results;
        }

        PageRequest pageRequest = PageRequest.of(0, 5); // Limit 5 results per entity type

        results.put("students", studentRepository.findByNameContainingIgnoreCase(query, pageRequest).getContent());
        results.put("courses", courseRepository.findByNameContainingIgnoreCase(query, pageRequest).getContent());
        
        // Note: You would need to add findByNameContainingIgnoreCase to TeacherRepository to enable this:
        // results.put("teachers", teacherRepository.findByNameContainingIgnoreCase(query, pageRequest).getContent());

        return results;
    }
}

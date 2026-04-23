package com.srms.backend.service;

import com.srms.backend.repository.PlacementApplicationRepository;
import com.srms.backend.repository.ResultRepository;
import com.srms.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final ResultRepository resultRepository;
    private final PlacementApplicationRepository placementRepo;

    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        long totalStudents = studentRepository.count();
        long passResults = resultRepository.countPassResults();
        long totalResults = resultRepository.count();
        
        double passPercentage = totalResults == 0 ? 0.0 : ((double) passResults / totalResults) * 100;
        
        metrics.put("totalStudents", totalStudents);
        metrics.put("passPercentage", Math.round(passPercentage * 100.0) / 100.0);
        
        long totalSelected = placementRepo.countByStatus("SELECTED");

        long totalPlacementApps = placementRepo.count();
        
        double placementRate = totalPlacementApps == 0 ? 0.0 : ((double) totalSelected / totalPlacementApps) * 100;
        metrics.put("placementRate", Math.round(placementRate * 100.0) / 100.0);

        return metrics;
    }

    public List<Map<String, Object>> getHardestCourses() {
        // PERF-01: Single batch query replaces N+1 individual findAverageMarksByCourse calls
        List<Object[]> rows = resultRepository.findAverageMarksByCourseBatch();
        
        return rows.stream()
            .limit(5)
            .map(row -> {
                Map<String, Object> map = new HashMap<>();
                map.put("courseName", row[1]);
                map.put("courseCode", row[2]);
                Double avgMarks = (Double) row[3];
                map.put("averageMarks", avgMarks != null ? Math.round(avgMarks * 100.0) / 100.0 : 0.0);
                return map;
            })
            .collect(Collectors.toList());
    }
}

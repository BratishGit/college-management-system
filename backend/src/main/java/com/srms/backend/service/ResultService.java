package com.srms.backend.service;

import com.srms.backend.entity.Result;
import com.srms.backend.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository resultRepository;

    public String calculateGrade(Double totalMarks) {
        if (totalMarks >= 90)
            return "O";
        if (totalMarks >= 80)
            return "A+";
        if (totalMarks >= 70)
            return "A";
        if (totalMarks >= 60)
            return "B";
        if (totalMarks >= 50)
            return "C";
        return "F";
    }

    public Double calculateGradePoints(String grade) {
        return switch (grade) {
            case "O" -> 10.0;
            case "A+" -> 9.0;
            case "A" -> 8.0;
            case "B" -> 7.0;
            case "C" -> 6.0;
            default -> 0.0;
        };
    }

    public Double calculateSGPA(List<Result> results) {
        double totalGradePoints = 0;
        int totalCredits = 0;
        for (Result r : results) {
            if (r.getSubject() != null) {
                totalGradePoints += r.getGradePoints() * r.getSubject().getCredits();
                totalCredits += r.getSubject().getCredits();
            }
        }
        return totalCredits == 0 ? 0.0 : totalGradePoints / totalCredits;
    }
}

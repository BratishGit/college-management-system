package com.srms.backend.controller;

import com.srms.backend.entity.Result;
import com.srms.backend.entity.User;
import com.srms.backend.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Result> saveOrUpdateResult(
            @RequestParam Long studentId,
            @RequestParam Long courseId,
            @RequestParam Double internalMarks,
            @RequestParam Double externalMarks,
            @AuthenticationPrincipal User teacherUser) {
        return ResponseEntity.ok(resultService.saveOrUpdateResult(studentId, courseId, internalMarks, externalMarks, teacherUser));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or (hasRole('STUDENT') and principal.id == #studentId)")
    public ResponseEntity<List<Result>> getResultsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(resultService.getResultsByStudent(studentId));
    }
}

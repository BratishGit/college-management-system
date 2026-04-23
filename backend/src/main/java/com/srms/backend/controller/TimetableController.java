package com.srms.backend.controller;

import com.srms.backend.entity.Timetable;
import com.srms.backend.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Timetable>> getTimetableByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(timetableService.getTimetableByCourse(courseId));
    }

    @GetMapping("/semester/{semester}")
    public ResponseEntity<List<Timetable>> getTimetableBySemester(@PathVariable Integer semester) {
        return ResponseEntity.ok(timetableService.getTimetableBySemester(semester));
    }
}

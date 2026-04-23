package com.srms.backend.controller;

import com.srms.backend.entity.Company;
import com.srms.backend.entity.PlacementApplication;
import com.srms.backend.entity.PlacementDrive;
import com.srms.backend.entity.User;
import com.srms.backend.service.PlacementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/placements")
@RequiredArgsConstructor
public class PlacementController {

    private final PlacementService placementService;

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(placementService.getAllCompanies());
    }

    @GetMapping("/drives/active")
    public ResponseEntity<List<PlacementDrive>> getActiveDrives() {
        return ResponseEntity.ok(placementService.getActiveDrives());
    }

    @PostMapping("/drives/{driveId}/apply/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<PlacementApplication> applyForDrive(
            @PathVariable Long driveId,
            @PathVariable Long studentId,
            @AuthenticationPrincipal User studentUser) {
        return ResponseEntity.ok(placementService.applyForDrive(driveId, studentId, studentUser));
    }

    @PatchMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,
            @AuthenticationPrincipal User adminUser) {
        placementService.updateApplicationStatus(applicationId, status, adminUser);
        return ResponseEntity.ok().build();
    }
}

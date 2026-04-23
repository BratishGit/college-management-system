package com.srms.backend.controller;

import com.srms.backend.entity.LeaveRequest;
import com.srms.backend.entity.User;
import com.srms.backend.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<LeaveRequest> applyForLeave(
            @RequestParam String reason,
            @RequestParam String type,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @AuthenticationPrincipal User studentUser) {
        return ResponseEntity.ok(leaveRequestService.applyForLeave(
                studentUser, reason, type, LocalDate.parse(startDate), LocalDate.parse(endDate)));
    }

    @GetMapping("/my-leaves")
    public ResponseEntity<List<LeaveRequest>> getMyLeaves(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(leaveRequestService.getMyLeaves(user));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaves());
    }

    @PatchMapping("/{id}/workflow")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> processLeaveWorkflow(
            @PathVariable Long id,
            @RequestParam String action,
            @AuthenticationPrincipal User approver) {
        leaveRequestService.processLeaveWorkflow(id, action, approver);
        return ResponseEntity.ok().build();
    }
}

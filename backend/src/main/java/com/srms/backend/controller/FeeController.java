package com.srms.backend.controller;

import com.srms.backend.entity.Fee;
import com.srms.backend.entity.FeePayment;
import com.srms.backend.entity.User;
import com.srms.backend.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<Fee>> getStudentFees(@PathVariable Long studentId) {
        return ResponseEntity.ok(feeService.getStudentFees(studentId));
    }

    @PostMapping("/{feeId}/payment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeePayment> processPayment(
            @PathVariable Long feeId,
            @RequestParam Double amount,
            @RequestParam String paymentMethod,
            @AuthenticationPrincipal User adminUser) {
        return ResponseEntity.ok(feeService.processPayment(feeId, amount, paymentMethod, adminUser));
    }
}

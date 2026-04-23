package com.srms.backend.service;

import com.srms.backend.entity.Fee;
import com.srms.backend.entity.FeePayment;
import com.srms.backend.entity.Student;
import com.srms.backend.entity.User;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.repository.FeePaymentRepository;
import com.srms.backend.repository.FeeRepository;
import com.srms.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FeeService {

    private final FeeRepository feeRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final StudentRepository studentRepository;
    private final AuditLogService auditLogService;

    public List<Fee> getStudentFees(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        return feeRepository.findByStudent(student);
    }

    @Transactional
    public FeePayment processPayment(Long feeId, Double amount, String paymentMethod, User performer) {
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee", "id", feeId));

        if (fee.getStatus().equals("PAID")) {
            throw new IllegalArgumentException("Fee is already fully paid.");
        }

        if (amount <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero.");
        }

        // BIZ-03: Prevent overpayment — cap at remaining balance
        double remainingBalance = fee.getTotalAmount() - fee.getPaidAmount();
        if (amount > remainingBalance) {
            throw new IllegalArgumentException("Payment amount (" + amount + ") exceeds remaining balance (" + remainingBalance + ").");
        }

        FeePayment payment = FeePayment.builder()
                .fee(fee)
                .amount(amount)
                .paymentMethod(paymentMethod)
                .transactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .paymentDate(LocalDateTime.now())
                .build();
        
        feePaymentRepository.save(payment);

        fee.setPaidAmount(fee.getPaidAmount() + amount);
        
        if (fee.getPaidAmount() >= fee.getTotalAmount()) {
            fee.setStatus("PAID");
        } else {
            fee.setStatus("PARTIAL");
        }
        
        feeRepository.save(fee);

        auditLogService.logAction("FEE_PAYMENT", performer, "FEE", fee.getId(), 
            "Processed payment of " + amount + " via " + paymentMethod);

        return payment;
    }
}

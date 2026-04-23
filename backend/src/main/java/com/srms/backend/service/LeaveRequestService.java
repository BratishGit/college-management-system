package com.srms.backend.service;

import com.srms.backend.entity.LeaveRequest;
import com.srms.backend.entity.User;
import com.srms.backend.exception.ResourceNotFoundException;
import com.srms.backend.exception.UnauthorizedActionException;
import com.srms.backend.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public LeaveRequest applyForLeave(User studentUser, String reason, String type, LocalDate startDate, LocalDate endDate) {
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .user(studentUser)
                .reason(reason)
                .type(type)
                .startDate(startDate)
                .endDate(endDate)
                .status("PENDING") // Simplified 2-stage workflow: PENDING -> APPROVED/REJECTED
                .build();
        
        leaveRequest = leaveRequestRepository.save(leaveRequest);

        auditLogService.logAction("LEAVE_APPLIED", studentUser, "LEAVE_REQUEST", leaveRequest.getId(), "Leave applied for dates: " + startDate + " to " + endDate);

        return leaveRequest;
    }

    public List<LeaveRequest> getMyLeaves(User user) {
        return leaveRequestRepository.findByUser(user);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    @Transactional
    public void processLeaveWorkflow(Long requestId, String action, User approver) {
        LeaveRequest request = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", "id", requestId));

        String approverRole = approver.getRole().name();
        String currentStatus = request.getStatus();

        // Simplified 2-stage workflow: PENDING -> APPROVED or REJECTED
        if (action.equalsIgnoreCase("REJECTED") || action.equalsIgnoreCase("REJECT")) {
            request.setStatus("REJECTED");
        } else if (action.equalsIgnoreCase("APPROVED") || action.equalsIgnoreCase("APPROVE")) {
            if (!"PENDING".equals(currentStatus)) {
                throw new IllegalArgumentException("Leave request is not in PENDING state");
            }
            request.setStatus("APPROVED");
        } else {
            throw new IllegalArgumentException("Unknown action: " + action + ". Use APPROVED or REJECTED.");
        }

        leaveRequestRepository.save(request);
        auditLogService.logAction("LEAVE_WORKFLOW", approver, "LEAVE_REQUEST", request.getId(), "Leave request " + action + " by " + approverRole);
    }
}

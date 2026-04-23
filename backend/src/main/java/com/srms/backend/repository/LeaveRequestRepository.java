package com.srms.backend.repository;

import com.srms.backend.entity.LeaveRequest;
import com.srms.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUser(User user);
    List<LeaveRequest> findByStatus(String status);
}

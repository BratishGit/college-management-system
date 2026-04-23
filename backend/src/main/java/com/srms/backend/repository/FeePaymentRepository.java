package com.srms.backend.repository;

import com.srms.backend.entity.FeePayment;
import com.srms.backend.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeePaymentRepository extends JpaRepository<FeePayment, Long> {
    List<FeePayment> findByFee(Fee fee);
}

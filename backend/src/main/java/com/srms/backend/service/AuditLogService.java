package com.srms.backend.service;

import com.srms.backend.entity.AuditLog;
import com.srms.backend.entity.User;
import com.srms.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional
    public void logAction(String action, User performer, String targetEntity, Long entityId, String details) {
        AuditLog log = AuditLog.builder()
                .action(action)
                .performer(performer)
                .targetEntity(targetEntity)
                .entityId(entityId)
                .details(details)
                .build();
        auditLogRepository.save(log);
    }
}

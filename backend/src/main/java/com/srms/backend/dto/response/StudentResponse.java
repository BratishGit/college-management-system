package com.srms.backend.dto.response;

import lombok.Data;

@Data
public class StudentResponse {
    private Long id;
    private String name;
    private String rollNumber;
    private String department;
    private Integer currentSemester;
    private String admissionStatus;
}

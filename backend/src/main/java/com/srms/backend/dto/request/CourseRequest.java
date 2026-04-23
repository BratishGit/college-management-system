package com.srms.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CourseRequest {
    @NotBlank(message = "Course code is required")
    private String code;

    @NotBlank(message = "Course name is required")
    private String name;

    @NotNull(message = "Credits are required")
    private Integer credits;

    @NotNull(message = "Semester is required")
    private Integer semester;

    private Long teacherId;
}

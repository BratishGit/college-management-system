package com.srms.backend.dto.response;

import lombok.Data;

@Data
public class CourseResponse {
    private Long id;
    private String code;
    private String name;
    private Integer credits;
    private Integer semester;
    private String teacherName;
}

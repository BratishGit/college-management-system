package com.srms.backend.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String entity, String field, Object value) {
        super(String.format("%s not found with %s: '%s'", entity, field, value));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

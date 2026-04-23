package com.srms.backend.exception;

public class UnauthorizedActionException extends RuntimeException {
    public UnauthorizedActionException(String message) {
        super(message);
    }

    public UnauthorizedActionException(String role, String action) {
        super(String.format("Role '%s' is not authorized to perform: %s", role, action));
    }
}

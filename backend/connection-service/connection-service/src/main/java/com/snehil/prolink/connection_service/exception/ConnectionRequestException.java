package com.snehil.prolink.connection_service.exception;

public class ConnectionRequestException extends RuntimeException {

    public ConnectionRequestException(String message) {
        super(message);
    }

    public ConnectionRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

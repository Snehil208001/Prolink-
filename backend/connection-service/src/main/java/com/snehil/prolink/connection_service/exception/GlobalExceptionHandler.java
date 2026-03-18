package com.snehil.prolink.connection_service.exception;

import lombok.extern.slf4j.Slf4j;
import org.neo4j.driver.exceptions.ServiceUnavailableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConnectionRequestException.class)
    public ResponseEntity<ApiError> handleConnectionRequestException(ConnectionRequestException ex) {
        ApiError apiError = new ApiError(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ServiceUnavailableException.class)
    public ResponseEntity<ApiError> handleNeo4jUnavailable(ServiceUnavailableException ex) {
        ApiError apiError = new ApiError(
                "Neo4j is unavailable. Ensure Neo4j is running (port 7687 or 7690) and the connection graph has data.",
                HttpStatus.SERVICE_UNAVAILABLE);
        return new ResponseEntity<>(apiError, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        String message = ex.getMessage();
        if (ex.getCause() instanceof ServiceUnavailableException) {
            message = "Neo4j is unavailable. Ensure Neo4j is running (port 7687 or 7690) and the connection graph has data.";
            return new ResponseEntity<>(new ApiError(message, HttpStatus.SERVICE_UNAVAILABLE), HttpStatus.SERVICE_UNAVAILABLE);
        }
        ApiError apiError = new ApiError(message != null ? message : "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

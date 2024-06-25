package com.medical.app.util;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Getter
public class ApiResponse<T> {
  private HttpStatus status;
  private String message;

  public ApiResponse(HttpStatus status, String message) {
    this.status = status;
    this.message = message;
  }

  public static ResponseEntity<ApiResponse> notImplemented(String message) {
    return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
        new ApiResponse<>(HttpStatus.NOT_IMPLEMENTED, message)
    );
  }

  public static ResponseEntity<ApiResponse> ok(String message) {
    return ResponseEntity.status(HttpStatus.OK).body(
        new ApiResponse<>(HttpStatus.OK, message)
    );
  }


  public static ResponseEntity<ApiResponse> unauthorized(String message) {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
        new ApiResponse<>(HttpStatus.UNAUTHORIZED, message)
    );
  }

  public static ResponseEntity<ApiResponse> forbidden(String message) {
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
        new ApiResponse<>(HttpStatus.FORBIDDEN, message)
    );
  }

  public static ResponseEntity<ApiResponse> locked(String message) {
    return ResponseEntity.status(HttpStatus.LOCKED).body(
        new ApiResponse<>(HttpStatus.LOCKED, message)
    );
  }

  public static ResponseEntity<ApiResponse> created(String message) {
    return ResponseEntity.status(HttpStatus.CREATED).body(
        new ApiResponse<>(HttpStatus.CREATED, message)
    );
  }

  public static ResponseEntity<ApiResponse> conflict(String message) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body(
        new ApiResponse<>(HttpStatus.CONFLICT, message)
    );
  }

  public static ResponseEntity<ApiResponse> notFound(String message) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        new ApiResponse<>(HttpStatus.NOT_FOUND, message)
    );
  }

  public static ResponseEntity<ApiResponse> badRequest(String message) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
        new ApiResponse<>(HttpStatus.BAD_REQUEST, message)
    );
  }
}

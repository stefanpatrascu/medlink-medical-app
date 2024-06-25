package com.medical.app.exception;

import com.medical.app.util.ApiResponse;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.sqm.PathElementException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
@Slf4j
@Getter
public class CustomExceptionHandler {

  @Value("${security.validation.display-validation-errors:false}")
  private boolean displayValidationErrors;

  @ExceptionHandler(ConflictException.class)
  public ResponseEntity<Object> handleConflictException(ConflictException ex) {
    ResponseEntity apiError = ApiResponse.conflict(ex.getMessage());
    log.error("ConflictException", ex);
    return new ResponseEntity<>(apiError.getBody(), apiError.getStatusCode());
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<Object> handleUnauthorizedException(UnauthorizedException ex) {
    ResponseEntity apiError = ApiResponse.unauthorized(ex.getMessage());
    log.error("UnauthorizedException", ex);
    return new ResponseEntity<>(apiError.getBody(), apiError.getStatusCode());
  }

  @ExceptionHandler(ForbiddenException.class)
  public ResponseEntity<Object> handleForbiddenException(ForbiddenException ex) {
    ResponseEntity apiError = ApiResponse.forbidden(ex.getMessage());
    log.error("ForbiddenException", ex);
    return new ResponseEntity<>(apiError.getBody(), apiError.getStatusCode());
  }

  @ExceptionHandler(ResourceLockedException.class)
  public ResponseEntity<Object> handleResourceLockedException(ResourceLockedException ex) {
    ResponseEntity apiError = ApiResponse.locked(ex.getMessage());
    log.error("ResourceLockedException", ex);
    return new ResponseEntity<>(apiError.getBody(), apiError.getStatusCode());
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<Object> handleNotFoundException(NotFoundException ex) {
    ResponseEntity apiError = ApiResponse.notFound(ex.getMessage());
    log.error("NotFoundException", ex);
    return new ResponseEntity<>(apiError.getBody(), apiError.getStatusCode());
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<Object> handleBadRequestException(BadRequestException ex) {
    ResponseEntity apiError = ApiResponse.badRequest(ex.getMessage());
    log.error("BadRequestException", ex);
    return new ResponseEntity<>(apiError.getBody(), apiError.getStatusCode());
  }

  @ExceptionHandler(PropertyReferenceException.class)
  public ResponseEntity<ApiResponse> handlePropertyReferenceException(PropertyReferenceException ex) {
    String message = "Invalid property key name";
    if (displayValidationErrors) {
      message = "Invalid field name: " + ex.getPropertyName();
    }
    log.error("PropertyReferenceException", ex);
    return ApiResponse.badRequest(message);
  }

  @ExceptionHandler(PathElementException.class)
  public ResponseEntity<ApiResponse> handlePathElementException(PropertyReferenceException ex) {
    String message = "Invalid attribute key name";
    if (displayValidationErrors) {
      message = "Invalid attribute name: " + ex.getPropertyName();
    }
    log.error("PathElementException", ex);
    return ApiResponse.badRequest(message);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiResponse> customValidationErrorHandling(
      MethodArgumentNotValidException ex,
      WebRequest request) {

    String message = "Your request contains validation errors";

    List<String> validationErrors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(error -> error.getField() + " " + error.getDefaultMessage())
        .collect(Collectors.toList());

    if (displayValidationErrors) {
      message = String.join(", ", validationErrors);
    }

    log.error("MethodArgumentNotValidException", ex);

    return ApiResponse.badRequest(message);
  }
}

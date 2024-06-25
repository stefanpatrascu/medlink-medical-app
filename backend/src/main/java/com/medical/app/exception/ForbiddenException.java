package com.medical.app.exception;

public class ForbiddenException  extends RuntimeException {
  public ForbiddenException(final String message) {
    super(message);
  }
}

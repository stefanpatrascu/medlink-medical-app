package com.medical.app.exception;

public class ResourceLockedException extends RuntimeException {
  public ResourceLockedException(String message) {
    super(message);
  }
}

package com.medical.app.account.service;

public interface LockAccountService {
  void addLoginAttempt(String ip);
  void clearOldLoginAttempts();
  boolean isAccountLocked(String email);
}

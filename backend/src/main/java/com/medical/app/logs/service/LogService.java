package com.medical.app.logs.service;

import com.medical.app.logs.enums.LogActionEnum;

public interface LogService {
  void addLog(LogActionEnum action, String description);
}

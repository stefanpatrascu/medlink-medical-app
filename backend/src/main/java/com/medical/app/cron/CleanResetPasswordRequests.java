package com.medical.app.cron;

import com.medical.app.account.service.impl.ResetPasswordImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class CleanResetPasswordRequests {

  final ResetPasswordImpl resetPasswordImpl;

  @Scheduled(fixedRate = 60000)
  public void cronTask() {
    log.info("Cleaned old reset password requests");
    resetPasswordImpl.clearOldResetPasswordRequests();
  }
}

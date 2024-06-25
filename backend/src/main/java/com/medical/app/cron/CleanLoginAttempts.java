package com.medical.app.cron;

import com.medical.app.account.service.impl.LockAccountServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class CleanLoginAttempts {

    final LockAccountServiceImpl loginAttemptsService;

    @Scheduled(fixedRate = 60000)
    public void cronTask() {
      log.info("Cleaned old login attempts");
      loginAttemptsService.clearOldLoginAttempts();
    }

}

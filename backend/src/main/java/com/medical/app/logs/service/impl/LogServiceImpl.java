package com.medical.app.logs.service.impl;

import com.medical.app.logs.entity.Log;
import com.medical.app.logs.enums.LogActionEnum;
import com.medical.app.logs.repository.LogRepository;
import com.medical.app.logs.service.LogService;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.pagination.service.PaginationService;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogServiceImpl implements LogService {

  private final LogRepository logRepository;
  private final HttpServletRequest request;
  private final PaginationService paginationService;

  public void addLog(LogActionEnum action, String description) {
    Log log = new Log();
    log.setAction(action);
    log.setDescription(description);
    log.setIp(getClientIP());
    log.setCreatedAt(LocalDateTime.now());

    logRepository.save(log);
  }

  public Page<Log> getLogsPageable(
      GenericRequestDTO requestFilterDTO) {

    Page<Log> appointmentsPage = logRepository.findAll(
        paginationService.createSpecification(requestFilterDTO.getFilters()),
        paginationService.createPageable(requestFilterDTO)
    );

    return appointmentsPage;
  }

  private String getClientIP() {
    final String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader != null) {
      return xfHeader.split(",")[0];
    }
    return request.getRemoteAddr();
  }
}

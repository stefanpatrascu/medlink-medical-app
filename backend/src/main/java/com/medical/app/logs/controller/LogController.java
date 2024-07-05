package com.medical.app.logs.controller;

import com.medical.app.logs.entity.Log;
import com.medical.app.logs.service.impl.LogServiceImpl;
import com.medical.app.pagination.dto.GenericRequestDTO;
import com.medical.app.user.constant.RoleConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/logs")
public class LogController {

  private final LogServiceImpl logService;

  @PostMapping("/all")
  @PreAuthorize(
      "hasAnyAuthority('" + RoleConstants.ADMIN + "')")
  public ResponseEntity<Page<Log>> getAllAppointments(@Valid @RequestBody GenericRequestDTO requestFilterDTO) {
    return ResponseEntity.ok(logService.getLogsPageable(requestFilterDTO));
  }
}

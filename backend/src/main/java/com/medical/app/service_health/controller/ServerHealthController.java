package com.medical.app.service_health.controller;

import com.medical.app.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/service-status")
public class ServerHealthController {

  @GetMapping("/health")
  public ResponseEntity<ApiResponse> ping() {
    return ApiResponse.ok("The service is up and running");
  }

}

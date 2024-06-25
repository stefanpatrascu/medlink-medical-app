package com.medical.app.clinics.controller;

import com.medical.app.clinics.dto.AddClinicDTO;
import com.medical.app.clinics.dto.UpdateClinicDTO;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.clinics.service.impl.ClinicServiceImpl;
import com.medical.app.util.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clinics")
@AllArgsConstructor
public class ClinicController {

  private final ClinicServiceImpl clinicServiceImpl;

  @GetMapping("/all")
  public ResponseEntity<List<Clinic>> getAllAppointments() {
    return ResponseEntity.ok(clinicServiceImpl.getAllClinics());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Clinic> getClinicById(@PathVariable Long clinicId) {
    return ResponseEntity.ok(clinicServiceImpl.getClinicById(clinicId));
  }

  @PutMapping("/{clinicId}")
  public ResponseEntity<ApiResponse> updateClinic(
      @PathVariable Long clinicId,
      @Valid @RequestBody UpdateClinicDTO updateClinicDTO) {
    return clinicServiceImpl.updateClinic(clinicId, updateClinicDTO);
  }

  @PostMapping("/create")
  public ResponseEntity<ApiResponse> createClinic(
      @Valid @RequestBody AddClinicDTO clinic) {
    return clinicServiceImpl.createClinic(clinic);
  }

  @DeleteMapping("/{clinicId}")
  public ResponseEntity<ApiResponse> deleteClinic(@PathVariable Long clinicId) {
    return clinicServiceImpl.deleteClinic(clinicId);
  }
}

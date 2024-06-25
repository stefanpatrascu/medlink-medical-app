package com.medical.app.clinics.service;

import com.medical.app.clinics.dto.AddClinicDTO;
import com.medical.app.clinics.dto.UpdateClinicDTO;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.util.ApiResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;

public interface ClinicService {
  List<Clinic> getAllClinics();
  Clinic getClinicById(Long id);
  ResponseEntity<ApiResponse> updateClinic(Long id, UpdateClinicDTO updateClinicDTO);
  ResponseEntity<ApiResponse> createClinic(AddClinicDTO clinic);
  ResponseEntity<ApiResponse> deleteClinic(Long id);
}

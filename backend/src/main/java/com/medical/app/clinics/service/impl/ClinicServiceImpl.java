package com.medical.app.clinics.service.impl;

import com.medical.app.clinics.dto.AddClinicDTO;
import com.medical.app.clinics.dto.UpdateClinicDTO;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.clinics.repository.ClinicRepository;
import com.medical.app.clinics.service.ClinicService;
import com.medical.app.exception.NotFoundException;
import com.medical.app.util.ApiResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
@Service
@AllArgsConstructor
public class ClinicServiceImpl implements ClinicService {

  private ClinicRepository clinicRepository;

  public List<Clinic> getAllClinics() {
    return clinicRepository.findAll();
  }

  public Clinic getClinicById(Long id) {
    return clinicRepository.findById(id).orElseThrow(() -> new NotFoundException("Clinic not found"));
  }

  public ResponseEntity<ApiResponse> updateClinic(Long id, UpdateClinicDTO updateClinicDTO) {
    Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new NotFoundException("Clinic not found"));
    clinic.setClinicName(updateClinicDTO.getClinicName());

    clinicRepository.save(clinic);

    return ApiResponse.ok("Clinic updated successfully");
  }

  public ResponseEntity<ApiResponse> createClinic(AddClinicDTO clinic) {
    Clinic newClinic = new Clinic();
    newClinic.setClinicName(clinic.getClinicName());
    clinicRepository.save(newClinic);
    return ApiResponse.ok("Clinic created successfully");
  }

  public ResponseEntity<ApiResponse> deleteClinic(Long id) {
    Clinic clinic = clinicRepository.findById(id).orElseThrow(() -> new NotFoundException("Clinic not found"));
    clinicRepository.delete(clinic);
    return ApiResponse.ok("Clinic deleted successfully");
  }
}

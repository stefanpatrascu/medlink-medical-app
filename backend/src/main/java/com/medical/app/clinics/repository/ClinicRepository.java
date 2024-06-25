package com.medical.app.clinics.repository;

import com.medical.app.clinics.entity.Clinic;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
@Repository
public interface ClinicRepository extends JpaRepository<Clinic, Long> {

  Optional<Clinic> findById(Long id);

  @Query("SELECT c FROM Clinic c WHERE c.id <> 1")
  List<Clinic> findAll();
}


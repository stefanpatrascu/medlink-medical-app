package com.medical.app.employee.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.medical.app.clinics.entity.Clinic;
import com.medical.app.employee.enums.EmployeeType;
import com.medical.app.employee.enums.SpecializationEnum;
import com.medical.app.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "employees")
public class Employee {

  @Id()
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "employee_type")
  @Enumerated(EnumType.STRING)
  private EmployeeType employeeType;

  @Column(name = "specialization")
  @Enumerated(EnumType.STRING)
  private SpecializationEnum specialization;

  @Column(name = "hire_date")
  private LocalDate hireDate;

  @OneToOne
  @JoinColumn(name = "clinic_id", referencedColumnName = "id")
  private Clinic clinic;

  @OneToOne
  @JsonBackReference
  @JoinColumn(name = "user_id", referencedColumnName = "id")
  private User user;

  @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
  private List<WorkProgram> workPrograms = new ArrayList<>();
}

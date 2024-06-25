package com.medical.app.employee.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.DayOfWeek;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "work_programs")
public class WorkProgram {
  @Id()
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @JsonIgnore
  @Column(name = "id")
  private Long id;

  @Column(name = "day")
  @Enumerated(EnumType.STRING)
  private DayOfWeek day;

  @OneToOne
  @JoinColumn(name = "employee_id", referencedColumnName = "id")
  @JsonBackReference
  private Employee employee;

  @JsonFormat(pattern = "HH:mm")
  @Column(name = "start_time")
  private LocalTime startTime;

  @JsonFormat(pattern = "HH:mm")
  @Column(name = "end_time")
  private LocalTime endTime;

}

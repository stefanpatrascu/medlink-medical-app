package com.medical.app.logs.entity;

import com.medical.app.logs.enums.LogActionEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "logs")
public class Log {

  @Id()
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "action")
  @Enumerated(EnumType.STRING)
  private LogActionEnum action;

  @Column(name = "description")
  private String description;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "ip")
  private String ip;
}

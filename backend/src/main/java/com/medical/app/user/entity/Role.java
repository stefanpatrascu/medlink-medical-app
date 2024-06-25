package com.medical.app.user.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.medical.app.user.enums.RoleEnum;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "roles")
@Getter
@Setter
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "role")
  @Enumerated(EnumType.STRING)
  private RoleEnum role;

  @ManyToOne
  @JsonBackReference
  @JoinColumn(name = "user_id", nullable = false)
  private User user;
}

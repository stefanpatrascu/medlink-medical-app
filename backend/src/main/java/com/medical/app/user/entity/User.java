package com.medical.app.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.medical.app.employee.entity.Employee;
import com.medical.app.user.enums.RoleEnum;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @JsonIgnore()
  @Column(name = "password")
  private String password;

  @Column(name = "email")
  private String email;

  @Column(name = "enabled")
  private boolean enabled;

  @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
  private Employee employee;

  @JsonIgnore
  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
  private Set<Role> roles;

  public Set<RoleEnum> getRolesList() {
    return roles.stream().map(Role::getRole).collect(Collectors.toSet());
  }

  @Column(name = "first_name")
  private String firstName;

  @Column(name = "last_name")
  private String lastName;

  @Formula("CONCAT(CASE WHEN prefix IS NULL THEN '' ELSE CONCAT(prefix, '') END, first_name, ' ', last_name)")
  private String fullName;

  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Column(name = "phone_num")
  private String phoneNumber;

  @Column(name = "cnp")
  private String cnp;

  @Column(name = "city")
  private String city;

  @Column(name = "county")
  private String county;

  @Column(name = "country")
  private String country;

  @Column(name = "postal_code")
  private String postalCode;

  @Column(name = "address")
  private String address;

  @Column(name = "prefix")
  private String prefix;

  @Column(name = "last_login")
  private LocalDateTime lastLogin;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}

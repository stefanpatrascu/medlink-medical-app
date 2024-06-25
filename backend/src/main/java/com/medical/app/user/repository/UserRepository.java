package com.medical.app.user.repository;

import com.medical.app.appointment.entity.Appointment;
import com.medical.app.user.entity.User;
import com.medical.app.user.enums.RoleEnum;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  @Query("SELECT u FROM User u INNER JOIN Role r ON u.id = r.user.id WHERE u.id = :id AND r.role = :role")
  User findUserByIdAndRole(Long id, RoleEnum role);

  @Query("SELECT u FROM User u INNER JOIN Role r ON u.id = r.user.id WHERE r.role = :role")
  List<User> findUsersByRole(RoleEnum role);

  @Query("""
      FROM User u WHERE u.email = :email
      OR u.cnp = :cnp
      """)
  List<User> findByEmailOrCnp(String email, String cnp);

  User findByEmail(String email);

  Page<User> findAll(Specification<Appointment> specification, Pageable pageable);

}

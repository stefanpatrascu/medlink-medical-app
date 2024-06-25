package com.medical.app.account.repository;

import com.medical.app.account.entity.PasswordReset;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetPasswordRepository extends JpaRepository<PasswordReset, String> {

  PasswordReset findByEmailAndOtp(String email, String otp);

  @Query("FROM PasswordReset r WHERE abs((local_datetime - r.resetDateTime) by minute) >= 30")
  List<PasswordReset> findResetPasswordResetToDelete();
}

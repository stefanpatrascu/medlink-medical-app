package com.medical.app.account.service.impl;

import com.medical.app.account.entity.PasswordReset;
import com.medical.app.account.repository.ResetPasswordRepository;
import com.medical.app.account.service.ResetPasswordService;
import com.medical.app.mail.SmtpService;
import com.medical.app.user.entity.User;
import com.medical.app.user.repository.UserRepository;
import com.medical.app.util.ApiResponse;
import java.security.SecureRandom;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class ResetPasswordImpl implements ResetPasswordService {

  private final SmtpService smtpService;
  private final ResetPasswordRepository resetPasswordRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public ResponseEntity<ApiResponse> checkIfEmailAndOtpExists(String email, String otp) {

    final PasswordReset passwordReset = resetPasswordRepository.findByEmailAndOtp(email, otp);

    if (email == null || otp == null) {
      log.error("Email or otp is null");
      return ApiResponse.badRequest("Email or otp is null");
    }

    if (passwordReset == null) {
      log.error("Trying to reset password for non-existing user with email: {}", email);
      return ApiResponse.unauthorized("Invalid email or otp");
    }

    return ApiResponse.ok("Email and otp are valid");
  }

  public void clearOldResetPasswordRequests() {
    List<PasswordReset> itemsToDelete = resetPasswordRepository.findResetPasswordResetToDelete();
    resetPasswordRepository.deleteAll(itemsToDelete);
  }

  public ResponseEntity<ApiResponse> sendResetPasswordEmail(String email) {

    final PasswordReset passwordReset = new PasswordReset();

    final User userFound = userRepository.findByEmail(email);

    if (userFound == null) {
      log.error("Trying to reset password for non-existing user with email: {}", email);
    } else {

      if (!userFound.isEnabled()) {
        log.error("Trying to reset password for disabled user with email: {}", email);
        return ApiResponse.ok("If the email exists in the database, a reset password email will be sent");
      }

      passwordReset.setEmail(email);
      passwordReset.setResetDateTime(LocalDateTime.now());
      passwordReset.setOtp(randomOtp());

      resetPasswordRepository.saveAndFlush(passwordReset);

      smtpService.sendEmail(email, "Reset password - MedLink",
          "Hello " + userFound.getFirstName() + ",\n\n"
              + "You have requested to reset your password. Use the following OTP to reset your password: \n\n"
              + passwordReset.getOtp() + "\n\n"
              + "If you did not request this, please ignore this email. The OTP will expire in 30 minutes.\n\n"
              + "MedLink Team");
    }

    return ApiResponse.ok("If the email exists in the database, a reset password email will be sent");
  }

  private String randomOtp() {
    return new DecimalFormat("000000").format(new SecureRandom().nextInt(999999));
  }

  @Transactional
  public ResponseEntity<ApiResponse> changePassword(String email, String password, String otp) {

    final PasswordReset passwordReset = resetPasswordRepository.findByEmailAndOtp(email, otp);

    if (passwordReset == null) {
      log.error("Trying to change password for non-existing user with email: {}", email);
      return ApiResponse.unauthorized("Invalid email or otp");
    } else {
      final User user = userRepository.findByEmail(email);
      user.setPassword(passwordEncoder.encode(password));
      userRepository.saveAndFlush(user);
      resetPasswordRepository.delete(passwordReset);
      return ApiResponse.ok("Password changed successfully");
    }
  }
}

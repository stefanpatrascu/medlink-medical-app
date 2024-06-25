package com.medical.app.mail;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SmtpService {

  @Value("${spring.mail.username}")
  private String fromEmail;

  @Autowired
  private JavaMailSender emailSender;

  public void sendEmail(String toEmail, String subject, String body){
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject(subject);
    message.setText(body);

    emailSender.send(message);


  }
}

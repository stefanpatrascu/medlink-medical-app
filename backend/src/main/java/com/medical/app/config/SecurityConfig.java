package com.medical.app.config;

import static org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter.Directive.COOKIES;

import com.medical.app.security.CsrfCookieFilter;
import com.medical.app.security.JwtAuthFilter;
import com.medical.app.user.service.impl.UserDetailsServiceImpl;
import java.util.Collections;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.HeaderWriterLogoutHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.header.writers.ClearSiteDataHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;

@Slf4j
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

  @Value("${security.csrf.enabled}")
  private Boolean csrfEnabled;

  @Value("${security.csrf.domain}")
  private String csrfDomain;

  @Value("#{'${security.cors.allowed-origins}'.split(',')}")
  private List<String> allowedOrigins;

  @Value("#{'${security.cors.allowed-methods}'.split(',')}")
  private List<String> allowedMethods;

  @Value("#{'${security.cors.allowed-headers}'.split(',')}")
  private List<String> allowedHeaders;

  @Value("#{'${security.cors.max-age}'.split(',')}")
  private Long maxAge;

  @Bean
  public JwtAuthFilter jwtAuthFilter() {
    return new JwtAuthFilter();
  }

  @Bean
  public CsrfCookieFilter csrfCookieFilter() {
    return new CsrfCookieFilter();
  }

  @Bean
  public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    return http.getSharedObject(AuthenticationManagerBuilder.class)
        .build();
  }

  @Bean
  public UserDetailsService userDetailsService() {
    return new UserDetailsServiceImpl();
  }

  @Bean
  SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {

    CsrfTokenRequestAttributeHandler csrfRequestHandler = new CsrfTokenRequestAttributeHandler();

    csrfRequestHandler.setCsrfRequestAttributeName(null); // is null because we want to add the token to every request
    http.securityContext(
        securityContext -> securityContext
            .requireExplicitSave(false)
    );
    http.sessionManagement(
        sessionManagement -> sessionManagement
            .sessionCreationPolicy(SessionCreationPolicy.ALWAYS)
    );

    http.cors(cors -> cors.
        configurationSource(
            request -> {
              CorsConfiguration corsConfiguration = new CorsConfiguration();
              corsConfiguration.setAllowedOrigins(allowedOrigins);
              corsConfiguration.setAllowedMethods(allowedMethods);
              corsConfiguration.setAllowedHeaders(allowedHeaders);
              corsConfiguration.setExposedHeaders(Collections.singletonList("Content-Disposition"));
              corsConfiguration.setAllowCredentials(true);
              corsConfiguration.setMaxAge(maxAge);
              return corsConfiguration;
            }
        ));

    http.logout((logout) -> logout
        .deleteCookies("JT")
        .logoutSuccessHandler((request, response, authentication) -> {
          new HeaderWriterLogoutHandler(new ClearSiteDataHeaderWriter(COOKIES)).logout(
              request,
              response,
              authentication);
        })
    );

    if (csrfEnabled) {
      http.addFilterAfter(csrfCookieFilter(), UsernamePasswordAuthenticationFilter.class);
      CookieCsrfTokenRepository tokenRepository = new CookieCsrfTokenRepository();
      tokenRepository.setCookieCustomizer(t -> {
        t.domain(csrfDomain);
        t.secure(true);
        t.httpOnly(false);
      });

      http.csrf(
          csrf -> csrf
              .csrfTokenRequestHandler(csrfRequestHandler)
              .ignoringRequestMatchers("/register", "/login", "/account/reset/**", "/service-status/**")
              .csrfTokenRepository(tokenRepository)
      );
    } else {
      http.csrf(AbstractHttpConfigurer::disable);
      log.warn("CSRF protection is disabled, do not use this in production");
    }

    http.addFilterBefore(jwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

    http.authorizeHttpRequests((requests) -> requests
        .requestMatchers("/login", "/register", "/account/reset/**", "/account/refresh", "/service-status/**")
        .permitAll()
        .anyRequest().authenticated()
    );

    http.authenticationProvider(authenticationProvider());

    http.formLogin(AbstractHttpConfigurer::disable);
    http.httpBasic(AbstractHttpConfigurer::disable);
    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
    authenticationProvider.setUserDetailsService(userDetailsService());
    authenticationProvider.setPasswordEncoder(passwordEncoder());
    return authenticationProvider;
  }
}

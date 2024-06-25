package com.medical.app.security;

import com.medical.app.user.service.impl.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

  @Autowired
  private JwtService jwtService;

  @Autowired
  private UserDetailsServiceImpl userDetailsServiceImpl;

  private final Set<String> restrictedEndpoints = Set.of("/account/refresh");

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {

    final String token = jwtService.extractTokenFromCookies(request);
    final String requestURI = request.getRequestURI();
    try {
      if (token != null && !restrictedEndpoints.contains(requestURI)) {
        final String username = jwtService.extractUsername(token, false);
        final UserDetails userDetails = userDetailsServiceImpl.loadUserByUsername(username);

        if (!jwtService.validateToken(token, userDetails)) {
          throw new SecurityException("Invalid Token");
        }

        final UsernamePasswordAuthenticationToken
            authenticationToken =
            new UsernamePasswordAuthenticationToken(userDetails,
                null, userDetails.getAuthorities());

        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
      }
    } catch (Exception e) {
      request.getSession().invalidate(); // Invalidate session
      SecurityContextHolder.clearContext(); // Clear security context

      log.error("Error authenticating user", e);
    }

    filterChain.doFilter(request, response);
  }
}

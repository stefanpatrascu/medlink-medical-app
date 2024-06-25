package com.medical.app.security;

import com.medical.app.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtService {

  @Value("${security.jwt.secret}")
  private String jwtSecret;

  @Value("${security.jwt.expiration}")
  private int jwtExpiration;

  @Value("${security.jwt.secure-cookie}")
  private boolean secureCookie;

  @Value("${security.jwt.cookie-expiration}")
  private int cookieExpiration;

  public String extractUsername(String token, boolean ignoreExpired) {
    return extractClaim(token, Claims::getSubject, ignoreExpired);
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration, true);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver, boolean ignoreExpired) {
    final Claims claims = extractAllClaims(token, ignoreExpired);
    return claimsResolver.apply(claims);
  }

  public String extractTokenFromCookies(HttpServletRequest request) {
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
      for (Cookie cookie : cookies) {
        if ("JT".equals(cookie.getName())) {
          return cookie.getValue();
        }
      }
    }
    return null;
  }

  private Claims extractAllClaims(String token, boolean ignoreExpired) {
    try {
      return Jwts
          .parser()
          .verifyWith(getSignKey())
          .build()
          .parseSignedClaims(token)
          .getPayload();
    } catch (ExpiredJwtException ex) {
      if (ignoreExpired) {
        // this is a special case where we want to ignore the exception and return the claims
        return ex.getClaims();
      } else {
        throw ex;
      }
    }
  }

  public Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  public Boolean validateToken(String token, UserDetails userDetails) {
    final String username = extractUsername(token, false);
    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  public String generateToken(User userDetails) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("roles", userDetails.getRoles());
    return createToken(claims, userDetails.getEmail());
  }

  public void saveJwtCookie(HttpServletResponse response, String value) {
    Cookie cookie = new Cookie("JT", value);
    cookie.setPath("/");
    cookie.setSecure(secureCookie);
    cookie.setMaxAge(cookieExpiration);
    cookie.setHttpOnly(true);
    response.addCookie(cookie);
  }

  private String createToken(Map<String, Object> claims, String username) {
    return Jwts.builder()
        .claims(claims)
        .subject(username)
        .issuedAt(new Date(System.currentTimeMillis()))
        .expiration(new Date((new Date()).getTime() + jwtExpiration))
        .signWith(getSignKey(), Jwts.SIG.HS256)
        .compact();
  }

  private SecretKey getSignKey() {
    byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
    return Keys.hmacShaKeyFor(keyBytes);
  }
}

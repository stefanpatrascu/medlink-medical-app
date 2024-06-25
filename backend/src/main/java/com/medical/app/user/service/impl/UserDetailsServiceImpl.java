package com.medical.app.user.service.impl;

import com.medical.app.user.repository.UserRepository;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * This class implements the UserDetailsService interface which is used by Spring Security to handle user
 * authentication. It provides the UserDetails object that Spring Security uses for authentication and validation.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

  @Autowired
  private UserRepository userRepository;

  /**
   * This method is used to load user-specific data by user name.
   * It overrides the method from UserDetailsService interface.
   *
   * @param username the username identifying the user whose data we want to load.
   *
   * @return a fully populated user record (never null)
   * @throws UsernameNotFoundException if the user could not be found or the user has no GrantedAuthority
   */
  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // Fetch the user from the database using the provided username (in this case, an email)
    com.medical.app.user.entity.User user = userRepository.findByEmail(username);

    // If the user does not exist in the database, throw an exception
    if (user == null) {
      throw new UsernameNotFoundException("User not found");
    }

    Collection<GrantedAuthority> authorities = user.getRoles().stream()
        .map(role -> new SimpleGrantedAuthority(role.getRole().toString()))
        .collect(Collectors.toList());

    // Return a Spring Security User object filled with the user's details
    return new User(user.getEmail(), user.getPassword(), authorities);
  }

}

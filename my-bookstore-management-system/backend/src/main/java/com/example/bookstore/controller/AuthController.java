package com.example.bookstore.controller;

import com.example.bookstore.dto.LoginRequest;
import com.example.bookstore.model.User;
import com.example.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody User user, Authentication authentication) {
        try {
            String role = user.getRole() == null || user.getRole().isBlank() ? "ROLE_USER" : user.getRole();
            if ("ROLE_ADMIN".equals(role)) {
                if (authentication == null
                        || !authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) {
                    return ResponseEntity.status(403).body("Only admins can create admin users");
                }
            }
            user.setRole(role);
            userService.registerUser(user);
            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.authenticateUser(loginRequest);
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            return ResponseEntity.ok().body(new java.util.HashMap<String, Object>() {
                {
                    put("token", token);
                    put("user", user);
                }
            });
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
package com.example.network.service;

import com.example.network.dto.AuthResponse;
import com.example.network.dto.LoginRequest;
import com.example.network.dto.RegisterRequest;
import com.example.network.model.Profile;
import com.example.network.model.User;
import com.example.network.repository.ProfileRepository;
import com.example.network.repository.UserRepository;
import com.example.network.security.JwtProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public UserService(UserRepository userRepository, 
                       ProfileRepository profileRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtProvider = jwtProvider;
    }

    // Register a new User and create an empty associated Profile
    @Transactional
    public void registerUser(RegisterRequest request) {
        // Manual validation checks (Core Java)
        if (request.email() == null || request.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.password() == null || request.password().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        if (request.fullName() == null || request.fullName().trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }
        if (request.role() == null) {
            throw new IllegalArgumentException("Role is required");
        }

        if (userRepository.findByEmail(request.email().trim().toLowerCase()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // 1. Create and persist User
        User user = new User(
                request.email().trim().toLowerCase(),
                passwordEncoder.encode(request.password()),
                request.role()
        );
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        User savedUser = userRepository.save(user);

        // 2. Create and persist Profile (linked 1:1 using @MapsId)
        Profile profile = new Profile(
                request.fullName().trim(),
                null, // title
                null, // bio
                null, // skills
                null, // college
                null, // branch
                null, // cgpa
                savedUser
        );
        profileRepository.save(profile);
    }

    // Authenticate credentials and return JWT Response
    public AuthResponse loginUser(LoginRequest request) {
        if (request.email() == null || request.password() == null) {
            throw new IllegalArgumentException("Email and password are required");
        }

        User user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate JWT Token
        String token = jwtProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        return new AuthResponse(token, user.getEmail(), user.getRole().name(), user.getId());
    }
}

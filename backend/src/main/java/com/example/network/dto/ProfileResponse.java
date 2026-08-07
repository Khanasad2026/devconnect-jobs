package com.example.network.dto;

import com.example.network.model.UserRole;

import java.util.UUID;

public record ProfileResponse(
    UUID id,
    String email,
    UserRole role,
    String fullName,
    String title,
    String bio,
    String skills,
    String college,
    String branch,
    Double cgpa,
    String resumeUrl
) {}

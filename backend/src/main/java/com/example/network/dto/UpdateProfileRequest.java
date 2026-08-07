package com.example.network.dto;

public record UpdateProfileRequest(
    String fullName,
    String title,
    String bio,
    String skills,
    String college,
    String branch,
    Double cgpa,
    String resumeUrl
) {}

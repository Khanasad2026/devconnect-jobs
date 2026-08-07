package com.example.network.dto;

import com.example.network.model.UserRole;

public record RegisterRequest(
    String email,
    String password,
    UserRole role,
    String fullName
) {}

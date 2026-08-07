package com.example.network.dto;

import java.util.UUID;

public record AuthResponse(
    String token,
    String email,
    String role,
    UUID userId
) {}

package com.example.network.dto;

public record LoginRequest(
    String email,
    String password
) {}

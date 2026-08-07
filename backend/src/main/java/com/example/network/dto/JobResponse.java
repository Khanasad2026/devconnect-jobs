package com.example.network.dto;

import com.example.network.model.JobRole;
import com.example.network.model.JobType;

import java.time.LocalDateTime;
import java.util.UUID;

public record JobResponse(
    UUID id,
    String title,
    String description,
    String location,
    String salary,
    Integer experienceRequired,
    JobRole jobRole,
    JobType jobType,
    UUID recruiterId,
    LocalDateTime createdAt
) {}

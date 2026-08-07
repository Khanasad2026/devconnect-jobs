package com.example.network.dto;

import com.example.network.model.JobRole;
import com.example.network.model.JobType;

public record CreateJobRequest(
    String title,
    String description,
    String location,
    String salary,
    Integer experienceRequired,
    JobRole jobRole,
    JobType jobType
) {}

package com.example.network.dto;

import com.example.network.model.ApplicationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record JobApplicationResponse(
    UUID id,
    UUID jobId,
    String jobTitle,
    UUID candidateId,
    String candidateName,
    String coverLetter,
    String resumeUrl,
    ApplicationStatus status,
    LocalDateTime appliedAt
) {}

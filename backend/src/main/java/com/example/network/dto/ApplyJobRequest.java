package com.example.network.dto;

import java.util.UUID;

public record ApplyJobRequest(
    UUID jobId,
    String coverLetter,
    String resumeUrl
) {}

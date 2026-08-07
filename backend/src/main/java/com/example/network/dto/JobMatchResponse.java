package com.example.network.dto;

import java.util.List;

public record JobMatchResponse(
    JobResponse job,
    int matchPercentage,
    List<String> matchedSkills
) {}

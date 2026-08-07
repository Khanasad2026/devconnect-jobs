package com.example.network.dto;

import java.util.UUID;

public record AiAgentRequest(
        String action, // "ANALYZE_SKILLS", "GENERATE_COVER_LETTER", "INTERVIEW_PREP", "CHAT"
        UUID candidateId,
        UUID jobId,
        String userPrompt,
        String apiKey
) {}

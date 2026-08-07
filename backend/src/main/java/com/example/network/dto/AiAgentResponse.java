package com.example.network.dto;

import java.util.List;

public record AiAgentResponse(
        String action,
        String responseText,
        List<String> suggestedSkillsToLearn,
        List<String> interviewQuestions
) {}

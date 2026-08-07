package com.example.network.controller;

import com.example.network.dto.AiAgentRequest;
import com.example.network.dto.AiAgentResponse;
import com.example.network.service.AiAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiAgentController {

    private final AiAgentService aiAgentService;

    public AiAgentController(AiAgentService aiAgentService) {
        this.aiAgentService = aiAgentService;
    }

    // POST /api/ai/career-agent - Interact with AI Career Assistant Agent
    @PostMapping("/career-agent")
    public ResponseEntity<AiAgentResponse> handleAgentRequest(@RequestBody AiAgentRequest request) {
        try {
            AiAgentResponse response = aiAgentService.processAgentRequest(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AiAgentResponse("ERROR", "AI Agent Error: " + e.getMessage(), null, null));
        }
    }
}

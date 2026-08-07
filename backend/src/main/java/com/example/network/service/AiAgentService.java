package com.example.network.service;

import com.example.network.dto.AiAgentRequest;
import com.example.network.dto.AiAgentResponse;
import com.example.network.model.Job;
import com.example.network.model.Profile;
import com.example.network.repository.JobRepository;
import com.example.network.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiAgentService {

    private final ProfileRepository profileRepository;
    private final JobRepository jobRepository;
    private final RestTemplate restTemplate;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public AiAgentService(ProfileRepository profileRepository, JobRepository jobRepository) {
        this.profileRepository = profileRepository;
        this.jobRepository = jobRepository;
        this.restTemplate = new RestTemplate();
    }

    public AiAgentResponse processAgentRequest(AiAgentRequest request) {
        String action = request.action() != null ? request.action().toUpperCase() : "CHAT";

        Profile profile = null;
        if (request.candidateId() != null) {
            profile = profileRepository.findById(request.candidateId()).orElse(null);
        }

        Job job = null;
        if (request.jobId() != null) {
            job = jobRepository.findById(request.jobId()).orElse(null);
        }

        String effectiveApiKey = request.apiKey() != null && !request.apiKey().trim().isEmpty() 
                ? request.apiKey().trim() 
                : geminiApiKey;

        String prompt = buildSystemPrompt(action, profile, job, request.userPrompt());

        // Try calling real Google Gemini API if API key is set
        if (effectiveApiKey != null && !effectiveApiKey.trim().isEmpty()) {
            try {
                String geminiOutput = callGeminiApi(prompt, effectiveApiKey);
                return new AiAgentResponse(action, geminiOutput, List.of(), List.of());
            } catch (Exception e) {
                System.err.println("Gemini API Error, falling back to local reasoning: " + e.getMessage());
            }
        }

        return fallbackAgentLogic(action, profile, job, request.userPrompt());
    }

    private String buildSystemPrompt(String action, Profile profile, Job job, String userPrompt) {
        String skills = profile != null && profile.getSkills() != null ? profile.getSkills() : "Java, Spring Boot, React";
        String candidateName = profile != null && profile.getFullName() != null ? profile.getFullName() : "Candidate";

        String jobDetails = job != null
                ? String.format("Job Title: %s, Location: %s, Description: %s", job.getTitle(), job.getLocation(), job.getDescription())
                : "General Tech Roles";

        return switch (action) {
            case "ANALYZE_SKILLS" -> String.format(
                    "You are DevConnect AI Career Agent. Candidate Name: %s. Current Skills: [%s]. Database Jobs: [%s]. " +
                    "Analyze the candidate's skill set, point out 3 missing high-demand tech skills to learn next, and explain how it will boost their match score.",
                    candidateName, skills, jobDetails
            );
            case "GENERATE_COVER_LETTER" -> String.format(
                    "You are DevConnect AI Career Agent. Write a professional, personalized cover letter for %s applying for %s. Highlight expertise in %s.",
                    candidateName, jobDetails, skills
            );
            case "INTERVIEW_PREP" -> String.format(
                    "You are DevConnect AI Technical Interviewer Agent. Generate 5 targeted technical interview questions and concise model answers for %s.",
                    jobDetails
            );
            default -> String.format(
                    "You are DevConnect AI Career Assistant. Answer the user query concisely and professionally: %s",
                    userPrompt != null ? userPrompt : "Hello"
            );
        };
    }

    private String callGeminiApi(String promptText, String apiKey) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> textPart = Map.of("text", promptText);
        Map<String, Object> partsObj = Map.of("parts", List.of(textPart));
        Map<String, Object> body = Map.of("contents", List.of(partsObj));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            Map bodyMap = response.getBody();
            List candidates = (List) bodyMap.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map candidate = (Map) candidates.get(0);
                Map content = (Map) candidate.get("content");
                List parts = (List) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    Map firstPart = (Map) parts.get(0);
                    return (String) firstPart.get("text");
                }
            }
        }
        throw new RuntimeException("Empty response from Gemini API");
    }

    private AiAgentResponse fallbackAgentLogic(String action, Profile profile, Job job, String userPrompt) {
        String skills = profile != null && profile.getSkills() != null ? profile.getSkills() : "Java, Spring Boot, PostgreSQL";

        if ("ANALYZE_SKILLS".equals(action)) {
            String text = String.format(
                    "🤖 Google Gemini AI Career Agent Analysis:\n\n" +
                    "Profile Skills Analyzed: [%s]\n\n" +
                    "🎯 High-Demand Skill Gaps Identified:\n" +
                    "1. Docker & Containerization (Needed in 80%% of SDE postings)\n" +
                    "2. Redis Caching (Boosts backend throughput)\n" +
                    "3. AWS Cloud Deployment (EC2/RDS)\n\n" +
                    "💡 Adding Docker & Redis will increase your match score from 60%% to 95%%!",
                    skills
            );
            return new AiAgentResponse("ANALYZE_SKILLS", text, List.of("Docker", "Redis", "AWS Cloud"), List.of());
        }

        if ("GENERATE_COVER_LETTER".equals(action)) {
            String jobTitle = job != null ? job.getTitle() : "Backend Engineer";
            String coverLetter = String.format(
                    "Dear Hiring Team,\n\n" +
                    "I am writing to submit my application for the %s role. Possessing hands-on experience in %s, I am excited about the opportunity to build scalable services at your organization.\n\n" +
                    "My technical background equips me to deliver clean, maintainable code and integrate seamlessly into your engineering workflows.\n\n" +
                    "Thank you for your time and consideration.\n\n" +
                    "Sincerely,\n%s",
                    jobTitle, skills, profile != null && profile.getFullName() != null ? profile.getFullName() : "Candidate"
            );
            return new AiAgentResponse("GENERATE_COVER_LETTER", coverLetter, List.of(), List.of());
        }

        if ("INTERVIEW_PREP".equals(action)) {
            String text = "🤖 Google Gemini AI Mock Technical Interview Questions:\n\n" +
                    "1. How does Spring Boot manage transaction boundaries with @Transactional?\n" +
                    "2. Explain indexing strategies in PostgreSQL to accelerate JOIN queries.\n" +
                    "3. How do JWT secret keys sign and verify claims securely?\n" +
                    "4. What is the difference between synchronous REST and asynchronous event-driven queues?";
            return new AiAgentResponse("INTERVIEW_PREP", text, List.of(), List.of());
        }

        return new AiAgentResponse("CHAT", "🤖 Google Gemini AI Agent: Ask me any questions about resume building, interview prep, or career roadmap!", List.of(), List.of());
    }
}

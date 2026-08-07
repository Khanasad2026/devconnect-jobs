package com.example.network.service;

import com.example.network.dto.CreateJobRequest;
import com.example.network.dto.JobResponse;
import com.example.network.model.Job;
import com.example.network.model.JobRole;
import com.example.network.model.User;
import com.example.network.model.UserRole;
import com.example.network.repository.JobRepository;
import com.example.network.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.example.network.dto.JobMatchResponse;
import com.example.network.model.Profile;
import com.example.network.repository.ProfileRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository, ProfileRepository profileRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    // Create a new job posting (Recruiter only)
    public JobResponse createJob(CreateJobRequest request, UUID recruiterId) {
        if (request.title() == null || request.title().trim().isEmpty()) {
            throw new IllegalArgumentException("Job title is required");
        }
        if (request.description() == null || request.description().trim().isEmpty()) {
            throw new IllegalArgumentException("Job description is required");
        }
        if (request.jobRole() == null || request.jobType() == null) {
            throw new IllegalArgumentException("Job role and job type are required");
        }

        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new IllegalArgumentException("Recruiter not found"));

        if (recruiter.getRole() != UserRole.RECRUITER) {
            throw new IllegalArgumentException("Only recruiters are allowed to post jobs");
        }

        Job job = new Job(
                request.title().trim(),
                request.description().trim(),
                request.location() != null ? request.location().trim() : "Remote",
                request.salary(),
                request.experienceRequired() != null ? request.experienceRequired() : 0,
                request.jobRole(),
                request.jobType(),
                recruiter
        );

        Job savedJob = jobRepository.save(job);
        return mapToJobResponse(savedJob);
    }

    // Get all active job postings
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    // Get jobs by Role filter (e.g., SDE, DATA_ANALYST)
    public List<JobResponse> getJobsByRole(JobRole jobRole) {
        return jobRepository.findByJobRole(jobRole).stream()
                .map(this::mapToJobResponse)
                .collect(Collectors.toList());
    }

    // Get job by ID
    public JobResponse getJobById(UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
        return mapToJobResponse(job);
    }

    // Helper method to map Entity to DTO cleanly
    private JobResponse mapToJobResponse(Job job) {
        return new JobResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getSalary(),
                job.getExperienceRequired(),
                job.getJobRole(),
                job.getJobType(),
                job.getRecruiter().getId(),
                job.getCreatedAt()
        );
    }

    // Skill-based matchmaking algorithm
    public List<JobMatchResponse> getRecommendedJobs(UUID candidateId) {
        Profile profile = profileRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        String candidateSkillsStr = profile.getSkills();
        if (candidateSkillsStr == null || candidateSkillsStr.trim().isEmpty()) {
            return jobRepository.findAll().stream()
                    .map(job -> new JobMatchResponse(mapToJobResponse(job), 0, List.of()))
                    .collect(Collectors.toList());
        }

        java.util.Set<String> candidateSkills = java.util.Arrays.stream(candidateSkillsStr.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        List<Job> allJobs = jobRepository.findAll();
        List<JobMatchResponse> recommendations = new java.util.ArrayList<>();

        for (Job job : allJobs) {
            java.util.List<String> matchedSkills = new java.util.ArrayList<>();
            String textToSearch = (job.getTitle() + " " + job.getDescription()).toLowerCase();

            for (String skill : candidateSkills) {
                if (textToSearch.contains(skill)) {
                    matchedSkills.add(skill);
                }
            }

            int matchPercentage = 0;
            if (!candidateSkills.isEmpty()) {
                matchPercentage = (int) Math.round(((double) matchedSkills.size() / candidateSkills.size()) * 100);
            }

            java.util.List<String> matchedSkillsOriginalCasing = java.util.Arrays.stream(candidateSkillsStr.split(","))
                    .map(String::trim)
                    .filter(skill -> matchedSkills.contains(skill.toLowerCase()))
                    .collect(Collectors.toList());

            recommendations.add(new JobMatchResponse(
                    mapToJobResponse(job),
                    matchPercentage,
                    matchedSkillsOriginalCasing
            ));
        }

        recommendations.sort((a, b) -> Integer.compare(b.matchPercentage(), a.matchPercentage()));
        return recommendations;
    }
}

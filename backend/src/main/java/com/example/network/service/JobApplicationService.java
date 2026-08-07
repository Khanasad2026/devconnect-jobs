package com.example.network.service;

import com.example.network.dto.ApplyJobRequest;
import com.example.network.dto.JobApplicationResponse;
import com.example.network.model.ApplicationStatus;
import com.example.network.model.Job;
import com.example.network.model.JobApplication;
import com.example.network.model.Profile;
import com.example.network.model.User;
import com.example.network.model.UserRole;
import com.example.network.repository.JobApplicationRepository;
import com.example.network.repository.JobRepository;
import com.example.network.repository.ProfileRepository;
import com.example.network.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository
    ) {
        this.jobApplicationRepository = jobApplicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    // Apply for a job listing (Candidate only)
    public JobApplicationResponse applyToJob(ApplyJobRequest request, UUID candidateId) {
        if (request.jobId() == null) {
            throw new IllegalArgumentException("Job ID is required");
        }

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidate user not found"));

        if (candidate.getRole() != UserRole.CANDIDATE) {
            throw new IllegalArgumentException("Only candidates are allowed to apply for jobs");
        }

        Job job = jobRepository.findById(request.jobId())
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found"));

        // Prevent double applications
        if (jobApplicationRepository.existsByJobIdAndCandidateId(request.jobId(), candidateId)) {
            throw new IllegalArgumentException("You have already applied to this job");
        }

        String resumeUrl = request.resumeUrl();
        if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
            // Fallback to candidate's profile resume if not explicitly provided in the request
            resumeUrl = profileRepository.findById(candidateId)
                    .map(Profile::getResumeUrl)
                    .orElse(null);
            
            if (resumeUrl == null || resumeUrl.trim().isEmpty()) {
                throw new IllegalArgumentException("Resume URL is required to apply for a job");
            }
        }

        JobApplication application = new JobApplication(
                candidate,
                job,
                request.coverLetter() != null ? request.coverLetter().trim() : "",
                resumeUrl.trim()
        );

        JobApplication savedApplication = jobApplicationRepository.save(application);
        return mapToResponse(savedApplication);
    }

    // Get all applications submitted by a candidate
    public List<JobApplicationResponse> getApplicationsForCandidate(UUID candidateId) {
        return jobApplicationRepository.findByCandidateId(candidateId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all applicants for a specific job listing (Recruiter who created the job only)
    public List<JobApplicationResponse> getApplicationsForJob(UUID jobId, UUID recruiterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found"));

        if (!job.getRecruiter().getId().equals(recruiterId)) {
            throw new IllegalArgumentException("Only the recruiter who posted this job can view its applicants");
        }

        return jobApplicationRepository.findByJobId(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update application stage/status (Recruiter who created the job only)
    public JobApplicationResponse updateApplicationStatus(UUID applicationId, ApplicationStatus status, UUID recruiterId) {
        if (status == null) {
            throw new IllegalArgumentException("Application status is required");
        }

        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found"));

        if (!application.getJob().getRecruiter().getId().equals(recruiterId)) {
            throw new IllegalArgumentException("Only the recruiter who posted the job can update application status");
        }

        application.setStatus(status);
        JobApplication updatedApplication = jobApplicationRepository.save(application);
        return mapToResponse(updatedApplication);
    }

    // Helper method to map Entity to DTO
    private JobApplicationResponse mapToResponse(JobApplication app) {
        String candidateName = profileRepository.findById(app.getCandidate().getId())
                .map(Profile::getFullName)
                .orElse(app.getCandidate().getEmail());

        return new JobApplicationResponse(
                app.getId(),
                app.getJob().getId(),
                app.getJob().getTitle(),
                app.getCandidate().getId(),
                candidateName,
                app.getCoverLetter(),
                app.getResumeUrl(),
                app.getStatus(),
                app.getAppliedAt()
        );
    }
}

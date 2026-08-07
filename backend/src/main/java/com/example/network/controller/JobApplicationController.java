package com.example.network.controller;

import com.example.network.dto.ApplyJobRequest;
import com.example.network.dto.JobApplicationResponse;
import com.example.network.model.ApplicationStatus;
import com.example.network.service.JobApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    // POST /api/applications?candidateId=UUID - Submit a new job application
    @PostMapping
    public ResponseEntity<?> applyToJob(@RequestParam UUID candidateId, @RequestBody ApplyJobRequest request) {
        try {
            JobApplicationResponse response = jobApplicationService.applyToJob(request, candidateId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting job application");
        }
    }

    // GET /api/applications/candidate/{candidateId} - List applications for candidate
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsForCandidate(@PathVariable UUID candidateId) {
        return ResponseEntity.ok(jobApplicationService.getApplicationsForCandidate(candidateId));
    }

    // GET /api/applications/job/{jobId}?recruiterId=UUID - List applications for a job posting
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getApplicationsForJob(@PathVariable UUID jobId, @RequestParam UUID recruiterId) {
        try {
            List<JobApplicationResponse> responses = jobApplicationService.getApplicationsForJob(jobId, recruiterId);
            return ResponseEntity.ok(responses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/applications/{id}/status?status=STATUS&recruiterId=UUID - Update application status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable UUID id,
            @RequestParam ApplicationStatus status,
            @RequestParam UUID recruiterId
    ) {
        try {
            JobApplicationResponse response = jobApplicationService.updateApplicationStatus(id, status, recruiterId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

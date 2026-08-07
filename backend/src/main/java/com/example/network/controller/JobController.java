package com.example.network.controller;

import com.example.network.dto.CreateJobRequest;
import com.example.network.dto.JobResponse;
import com.example.network.model.JobRole;
import com.example.network.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // POST /api/jobs?recruiterId=UUID - Create a new job listing
    @PostMapping
    public ResponseEntity<?> createJob(@RequestParam UUID recruiterId, @RequestBody CreateJobRequest request) {
        try {
            JobResponse response = jobService.createJob(request, recruiterId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating job posting");
        }
    }

    // GET /api/jobs - List all jobs
    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // GET /api/jobs/role/{role} - Filter jobs by domain role (e.g., SDE, DATA_ANALYST)
    @GetMapping("/role/{role}")
    public ResponseEntity<List<JobResponse>> getJobsByRole(@PathVariable JobRole role) {
        return ResponseEntity.ok(jobService.getJobsByRole(role));
    }

    // GET /api/jobs/{id} - Get single job details
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable UUID id) {
        try {
            JobResponse response = jobService.getJobById(id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

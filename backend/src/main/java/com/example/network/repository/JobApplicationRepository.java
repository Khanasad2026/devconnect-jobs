package com.example.network.repository;

import com.example.network.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {
    List<JobApplication> findByCandidateId(UUID candidateId);
    List<JobApplication> findByJobId(UUID jobId);
}

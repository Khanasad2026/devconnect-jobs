package com.example.network.repository;

import com.example.network.model.Job;
import com.example.network.model.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID> {
    List<Job> findByJobRole(JobRole jobRole);
    List<Job> findByRecruiterId(UUID recruiterId);
}

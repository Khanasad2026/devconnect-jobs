package com.example.network.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    private UUID id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String title;
    private String bio;
    private String skills;

    private String college;
    private String branch;
    private Double cgpa;

    @Column(name = "resume_url")
    private String resumeUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    // Default constructor
    public Profile() {
    }

    // Constructor to easily create new profiles
    public Profile(String fullName, String title, String bio, String skills, String college, String branch, Double cgpa, User user) {
        this.fullName = fullName;
        this.title = title;
        this.bio = bio;
        this.skills = skills;
        this.college = college;
        this.branch = branch;
        this.cgpa = cgpa;
        this.user = user;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

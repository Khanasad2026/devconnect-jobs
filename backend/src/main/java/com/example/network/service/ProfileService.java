package com.example.network.service;

import com.example.network.dto.ProfileResponse;
import com.example.network.dto.UpdateProfileRequest;
import com.example.network.model.Profile;
import com.example.network.model.User;
import com.example.network.repository.ProfileRepository;
import com.example.network.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // Update profile details
    public ProfileResponse updateProfile(UpdateProfileRequest request, UUID userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));

        if (request.fullName() != null && !request.fullName().trim().isEmpty()) {
            profile.setFullName(request.fullName().trim());
        }
        if (request.title() != null) {
            profile.setTitle(request.title().trim());
        }
        if (request.bio() != null) {
            profile.setBio(request.bio().trim());
        }
        if (request.skills() != null) {
            profile.setSkills(request.skills().trim());
        }
        if (request.college() != null) {
            profile.setCollege(request.college().trim());
        }
        if (request.branch() != null) {
            profile.setBranch(request.branch().trim());
        }
        if (request.cgpa() != null) {
            profile.setCgpa(request.cgpa());
        }
        if (request.resumeUrl() != null) {
            profile.setResumeUrl(request.resumeUrl().trim());
        }

        Profile updatedProfile = profileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    // Get user profile details
    public ProfileResponse getProfile(UUID userId) {
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        return mapToResponse(profile);
    }

    // Map entity to response DTO
    private ProfileResponse mapToResponse(Profile profile) {
        User user = profile.getUser();
        return new ProfileResponse(
                profile.getId(),
                user.getEmail(),
                user.getRole(),
                profile.getFullName(),
                profile.getTitle(),
                profile.getBio(),
                profile.getSkills(),
                profile.getCollege(),
                profile.getBranch(),
                profile.getCgpa(),
                profile.getResumeUrl()
        );
    }
}

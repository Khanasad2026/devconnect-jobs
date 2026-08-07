package com.example.network.controller;

import com.example.network.dto.ProfileResponse;
import com.example.network.dto.UpdateProfileRequest;
import com.example.network.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // GET /api/profiles/{userId} - Retrieve profile details
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable UUID userId) {
        try {
            ProfileResponse response = profileService.getProfile(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/profiles?userId=UUID - Edit profile details
    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestParam UUID userId, @RequestBody UpdateProfileRequest request) {
        try {
            ProfileResponse response = profileService.updateProfile(request, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

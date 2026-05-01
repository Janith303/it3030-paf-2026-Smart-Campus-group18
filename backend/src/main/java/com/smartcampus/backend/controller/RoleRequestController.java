package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.RoleRequest;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.RoleRequestRepository;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.NotificationService;
import com.smartcampus.backend.model.NotificationType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/role-requests")
public class RoleRequestController {

    private final RoleRequestRepository roleRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public RoleRequestController(RoleRequestRepository roleRequestRepository,
                                  UserRepository userRepository,
                                  NotificationService notificationService) {
        this.roleRequestRepository = roleRequestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    // POST /api/role-requests — submit a role request
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<RoleRequest> submitRequest(
            @RequestParam String requestedRole,
            @RequestParam String reason,
            @RequestParam(required = false) MultipartFile image,
            Principal principal) {

        User user = userRepository.findByEmail(principal.getName()).orElseThrow();

        RoleRequest request = new RoleRequest();
        request.setUser(user);
        request.setRequestedRole(requestedRole);
        request.setReason(reason);
        request.setStatus("PENDING");
        request.setCreatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            try {
                String uploadPath = System.getProperty("user.dir") + "/uploads/";
                File uploadDir = new File(uploadPath);
                if (!uploadDir.exists()) uploadDir.mkdirs();
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                File dest = new File(uploadDir, fileName);
                image.transferTo(dest);
                request.setImageUrl("uploads/" + fileName);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        RoleRequest saved = roleRequestRepository.save(request);

        // Notify all admins
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                admin,
                user.getName() + " has requested to become a " + requestedRole,
                NotificationType.TICKET_STATUS_CHANGED,
                saved.getId()
            );
        }

        return ResponseEntity.ok(saved);
    }

    // GET /api/role-requests/my — user sees their own requests
    @GetMapping("/my")
    public ResponseEntity<List<RoleRequest>> getMyRequests(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(roleRequestRepository.findByUser(user));
    }

    // GET /api/role-requests — admin sees all requests
    @GetMapping
    public ResponseEntity<List<RoleRequest>> getAllRequests() {
        return ResponseEntity.ok(roleRequestRepository.findAllByOrderByCreatedAtDesc());
    }

    // PUT /api/role-requests/{id}/approve — admin approves
    @PutMapping("/{id}/approve")
    public ResponseEntity<RoleRequest> approveRequest(@PathVariable Long id) {
        RoleRequest request = roleRequestRepository.findById(id).orElseThrow();
        request.setStatus("APPROVED");
        roleRequestRepository.save(request);

        // Update user role
        User user = request.getUser();
        user.setRole(Role.valueOf(request.getRequestedRole()));
        userRepository.save(user);

        // Notify user
        notificationService.createNotification(
            user,
            "Your request to become a " + request.getRequestedRole() + " has been approved!",
            NotificationType.TICKET_STATUS_CHANGED,
            id
        );

        return ResponseEntity.ok(request);
    }

    // PUT /api/role-requests/{id}/reject — admin rejects
    @PutMapping("/{id}/reject")
    public ResponseEntity<RoleRequest> rejectRequest(@PathVariable Long id) {
        RoleRequest request = roleRequestRepository.findById(id).orElseThrow();
        request.setStatus("REJECTED");
        roleRequestRepository.save(request);

        // Notify user
        notificationService.createNotification(
            request.getUser(),
            "Your request to become a " + request.getRequestedRole() + " has been rejected.",
            NotificationType.TICKET_STATUS_CHANGED,
            id
        );

        return ResponseEntity.ok(request);
    }
}
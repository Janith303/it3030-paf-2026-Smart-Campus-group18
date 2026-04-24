package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Notification;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                   UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    // GET /api/notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    // GET /api/notifications/unread-count
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        long count = notificationService.getUnreadCount(user.getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PUT /api/notifications/mark-all-read
    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllRead(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.noContent().build();
    }

    // PUT /api/notifications/{id}/read
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markOneRead(@PathVariable Long id) {
        notificationService.markOneAsRead(id);
        return ResponseEntity.noContent().build();
    }
}
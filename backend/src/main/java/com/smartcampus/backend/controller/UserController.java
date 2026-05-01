package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    public UserController(UserRepository userRepository,
                          NotificationService notificationService,
                          BookingRepository bookingRepository,
                          TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.bookingRepository = bookingRepository;
        this.ticketRepository = ticketRepository;
    }

    // GET /api/users/me — get my own profile
    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(user);
    }

    // GET /api/users — get all users (admin only)
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // PUT /api/users/{id}/role — change a user's role (admin only)
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id).orElseThrow();
        try {
            Role newRole = Role.valueOf(body.get("role").toUpperCase());
            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET /api/users/technicians — get all technician users
    @GetMapping("/technicians")
    public ResponseEntity<List<User>> getTechnicians() {
        return ResponseEntity.ok(userRepository.findByRole(Role.TECHNICIAN));
    }

    // DELETE /api/users/{id} — Member 4: delete user and all related records
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();

        // 1. Delete notifications
        notificationService.clearAll(id);

        // 2. Delete bookings
        bookingRepository.deleteAll(bookingRepository.findByUserId(id));

        // 3. Nullify ticket references (set created_by to null instead of deleting tickets)
        ticketRepository.findByCreatedBy(user).forEach(ticket -> {
            ticket.setCreatedBy(null);
            ticketRepository.save(ticket);
        });

        // 4. Delete user
        userRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
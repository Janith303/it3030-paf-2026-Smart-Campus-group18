package com.smartcampus.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.security.Principal;

import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.service.TicketService;
import com.smartcampus.backend.service.CommentService;
import com.smartcampus.backend.service.ActivityService;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.Comment;
import com.smartcampus.backend.model.Activity;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.dto.TicketRequestDTO;
import com.smartcampus.backend.dto.AssignDTO;
import com.smartcampus.backend.dto.StatusUpdateDTO;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;
    private final ActivityService activityService;
    private final UserRepository userRepository;

    public TicketController(TicketService ticketService, CommentService commentService, ActivityService activityService, UserRepository userRepository) {
        this.ticketService = ticketService;
        this.commentService = commentService;
        this.activityService = activityService;
        this.userRepository = userRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createWithFiles(
            @RequestParam String location,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String priority,
            @RequestParam(required = false) String preferredContact,
            @RequestParam(required = false) List<MultipartFile> files,
            Principal principal
    ) {
        Ticket created = ticketService.createTicketWithFiles(
                location, category, description, priority, preferredContact, files
        );

        // Member 4 — save the logged in user as the creator
        if (principal != null) {
            userRepository.findByEmail(principal.getName()).ifPresent(user -> {
                created.setCreatedBy(user);
                ticketService.saveTicket(created);
            });
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // GET /api/tickets — admin sees all tickets
    @GetMapping
    public ResponseEntity<List<Ticket>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET /api/tickets/my — user sees only their own tickets
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        return ResponseEntity.ok(ticketService.getTicketsByUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assign(
            @PathVariable Long id,
            @RequestBody AssignDTO dto) {
        if (dto.technicianId != null) {
            return ResponseEntity.ok(ticketService.assignTechnicianById(id, dto.technicianId));
        }
        return ResponseEntity.ok(ticketService.assignTechnician(id, dto.assignedTo));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO dto) {
        return ResponseEntity.ok(ticketService.updateStatus(id, dto.status));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String message = body.get("message");
        String author = body.getOrDefault("author", "User");
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(commentService.addComment(id, author, message));
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        if (user == null || !user.getRole().equals(Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Only admin can delete comments");
        }
        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted");
    }

    @GetMapping("/technician/{name}")
    public ResponseEntity<List<Ticket>> getTechTickets(@PathVariable String name) {
        return ResponseEntity.ok(ticketService.getTechnicianTickets(name));
    }

    @GetMapping("/technician/id/{id}")
    public ResponseEntity<List<Ticket>> getByTechnicianId(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTechnicianTicketsById(id));
    }

    @GetMapping("/technician/{name}/stats")
    public ResponseEntity<Map<String, Long>> getStats(@PathVariable String name) {
        return ResponseEntity.ok(ticketService.getTechnicianStats(name));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Ticket> resolve(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                ticketService.addResolution(id, body.get("notes")));
    }

    @GetMapping("/{id}/activities")
    public ResponseEntity<List<Activity>> getActivities(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivities(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok().body("Ticket deleted successfully");
    }
}
package com.smartcampus.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

import com.smartcampus.backend.service.TicketService;
import com.smartcampus.backend.service.CommentService;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.Comment;
import com.smartcampus.backend.dto.TicketRequestDTO;
import com.smartcampus.backend.dto.AssignDTO;
import com.smartcampus.backend.dto.StatusUpdateDTO;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;

    public TicketController(TicketService ticketService, CommentService commentService) {
        this.ticketService = ticketService;
        this.commentService = commentService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createWithFiles(
            @RequestParam String location,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam String priority,
            @RequestParam(required = false) String preferredContact,
            @RequestParam(required = false) List<MultipartFile> files
    ) {
        System.out.println("API HIT: Creating ticket with files - " + description);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ticketService.createTicketWithFiles(
                        location, category, description, priority, preferredContact, files
                ));
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAll() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<Ticket> assign(
            @PathVariable Long id,
            @RequestBody AssignDTO dto) {
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
}
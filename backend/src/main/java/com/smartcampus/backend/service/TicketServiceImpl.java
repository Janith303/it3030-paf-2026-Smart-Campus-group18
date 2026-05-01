package com.smartcampus.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.io.File;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.NotificationType;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.dto.TicketRequestDTO;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository repo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private NotificationService notificationService;

    private String generateTicketCode() {
        Ticket last = repo.findTopByOrderByIdDesc();
        int nextNumber = 1001;
        if (last != null && last.getTicketCode() != null) {
            try {
                String lastCode = last.getTicketCode().replace("TKT-", "");
                nextNumber = Integer.parseInt(lastCode) + 1;
            } catch (Exception e) {
                nextNumber = 1001;
            }
        }
        return "TKT-" + nextNumber;
    }

    @Override
    public Ticket createTicket(TicketRequestDTO dto) {
        Ticket t = new Ticket();
        t.setTicketCode(generateTicketCode());
        t.setLocation(dto.location);
        t.setCategory(dto.category);
        t.setDescription(dto.description);
        t.setPriority(dto.priority);
        t.setPreferredContact(dto.preferredContact);
        t.setStatus("OPEN");
        t.setAssignedTo("Unassigned");
        t.setCreatedAt(LocalDateTime.now());

        Ticket saved = repo.save(t);
        activityService.log(saved.getId(), "Ticket created", "CREATED");
        return saved;
    }

    @Override
    public Ticket createTicketWithFiles(
            String location,
            String category,
            String description,
            String priority,
            String contact,
            List<MultipartFile> files
    ) {
        Ticket t = new Ticket();
        t.setTicketCode(generateTicketCode());
        t.setLocation(location);
        t.setCategory(category);
        t.setDescription(description);
        t.setPriority(priority);
        t.setPreferredContact(contact);
        t.setStatus("OPEN");
        t.setAssignedTo("Unassigned");
        t.setCreatedAt(LocalDateTime.now());

        List<String> filePaths = new ArrayList<>();

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                try {
                    if (!file.isEmpty()) {
                        String uploadPath = System.getProperty("user.dir") + "/uploads/";
                        File uploadDir = new File(uploadPath);
                        if (!uploadDir.exists()) {
                            uploadDir.mkdirs();
                        }
                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        File dest = new File(uploadDir, fileName);
                        file.transferTo(dest);
                        filePaths.add("uploads/" + fileName);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        t.setAttachments(filePaths.isEmpty() ? "" : String.join(",", filePaths));

        Ticket saved = repo.save(t);
        activityService.log(saved.getId(), "Ticket created", "CREATED");

        // Member 4 — notify the user who created the ticket
        if (saved.getCreatedBy() != null) {
            notificationService.createNotification(
                saved.getCreatedBy(),
                "Your ticket " + saved.getTicketCode() + " has been submitted successfully!",
                NotificationType.TICKET_STATUS_CHANGED,
                saved.getId()
            );
        }

        // Member 4 — notify all admins about the new ticket
        List<User> admins = userRepo.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                admin,
                "New ticket " + saved.getTicketCode() + " submitted: " + description,
                NotificationType.TICKET_STATUS_CHANGED,
                saved.getId()
            );
        }

        return saved;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    // Member 4 — returns only tickets created by this user
    @Override
    public List<Ticket> getTicketsByUser(User user) {
        return repo.findByCreatedBy(user);
    }

    // Member 4 — saves a ticket
    @Override
    public Ticket saveTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    @Override
    public Ticket getTicketById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public Ticket assignTechnician(Long id, String technician) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        t.setAssignedTo(technician);
        t.setStatus("IN_PROGRESS");
        Ticket saved = repo.save(t);
        activityService.log(id, "Technician assigned to " + technician, "ASSIGNED");
        return saved;
    }

    @Override
    public Ticket assignTechnicianById(Long id, Long technicianId) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        User user = userRepo.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician user not found"));
        t.setAssignedTo(user.getName());
        t.setTechnician(user);
        t.setStatus("IN_PROGRESS");
        Ticket saved = repo.save(t);
        activityService.log(id, "Technician assigned to " + user.getName(), "ASSIGNED");

        // Member 4 — notify the user who created the ticket that a technician was assigned
        if (t.getCreatedBy() != null) {
            notificationService.createNotification(
                t.getCreatedBy(),
                "A technician has been assigned to your ticket " + t.getTicketCode(),
                NotificationType.TICKET_STATUS_CHANGED,
                id
            );
        }

        // Member 4 — notify the technician they have been assigned a ticket
        notificationService.createNotification(
            user,
            "You have been assigned to ticket " + t.getTicketCode() + ": " + t.getDescription(),
            NotificationType.TICKET_STATUS_CHANGED,
            id
        );

        return saved;
    }

    @Override
    public Ticket updateStatus(Long id, String status) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        t.setStatus(status);
        Ticket saved = repo.save(t);
        activityService.log(id, "Status updated to " + status, "STATUS");

        // Member 4 — notify the user who created the ticket about status change
        if (t.getCreatedBy() != null) {
            notificationService.createNotification(
                t.getCreatedBy(),
                "Your ticket " + t.getTicketCode() + " status has been updated to " + status,
                NotificationType.TICKET_STATUS_CHANGED,
                id
            );
        }

        return saved;
    }

    @Override
    public List<Ticket> getTechnicianTickets(String name) {
        return repo.findByAssignedTo(name);
    }

    @Override
    public List<Ticket> getTechnicianTicketsById(Long technicianId) {
        return repo.findByTechnician_Id(technicianId);
    }

    @Override
    public Map<String, Long> getTechnicianStats(String name) {
        List<Ticket> tickets = repo.findByAssignedTo(name);

        long total = tickets.size();
        long inProgress = tickets.stream()
                .filter(ticket -> "IN_PROGRESS".equals(ticket.getStatus()))
                .count();

        long completedToday = tickets.stream()
                .filter(ticket -> "RESOLVED".equals(ticket.getStatus()))
                .filter(ticket -> ticket.getCreatedAt().toLocalDate()
                        .equals(LocalDate.now()))
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("assigned", total);
        stats.put("inProgress", inProgress);
        stats.put("completedToday", completedToday);

        return stats;
    }

    @Override
    public Ticket addResolution(Long id, String notes) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        t.setStatus("RESOLVED");
        t.setCreatedAt(t.getCreatedAt());
        Ticket saved = repo.save(t);
        activityService.log(id, "Ticket resolved", "STATUS");

        // Member 4 — notify the user who created the ticket about resolution
        if (t.getCreatedBy() != null) {
            notificationService.createNotification(
                t.getCreatedBy(),
                "Your ticket " + t.getTicketCode() + " has been resolved!",
                NotificationType.TICKET_STATUS_CHANGED,
                id
            );
        }

        activityService.log(id, "Resolved: " + notes, "RESOLUTION");

        return saved;
    }

    @Override
    public void deleteTicket(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Ticket not found");
        }
        repo.deleteById(id);
    }
}
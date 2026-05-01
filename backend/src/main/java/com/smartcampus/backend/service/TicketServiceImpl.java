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
        System.out.println("SAVED TO DB: " + saved.getTicketCode());
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
        System.out.println("FILES RECEIVED IN SERVICE: " + files);

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
                        System.out.println("UPLOAD DIR: " + uploadPath);

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

        System.out.println("FILES SAVED: " + filePaths);

        t.setAttachments(filePaths.isEmpty() ? "" : String.join(",", filePaths));

        Ticket saved = repo.save(t);
        System.out.println("SAVED TO DB: " + saved.getTicketCode() + " | Attachments: " + saved.getAttachments());
        activityService.log(saved.getId(), "Ticket created", "CREATED");
        return saved;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return repo.findAll();
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
        return saved;
    }

    @Override
    public Ticket updateStatus(Long id, String status) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        t.setStatus(status);
        Ticket saved = repo.save(t);
        activityService.log(id, "Status updated to " + status, "STATUS");
        return saved;
    }

    @Override
    public List<Ticket> getTechnicianTickets(String name) {
        return repo.findByAssignedTo(name);
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
        t.setDescription(t.getDescription() + "\n\nRESOLUTION: " + notes);
        Ticket saved = repo.save(t);
        activityService.log(id, "Ticket resolved", "STATUS");
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
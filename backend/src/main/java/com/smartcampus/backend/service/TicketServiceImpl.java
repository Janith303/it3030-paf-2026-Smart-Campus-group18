package com.smartcampus.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.io.File;

import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.dto.TicketRequestDTO;

@Service
public class TicketServiceImpl implements TicketService {

    @Autowired
    private TicketRepository repo;

    @Override
    public Ticket createTicket(TicketRequestDTO dto) {
        Ticket t = new Ticket();
        t.setTicketCode("TKT-" + (repo.count() + 1001));
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
        t.setTicketCode("TKT-" + (repo.count() + 1001));
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
        return repo.save(t);
    }

    @Override
    public Ticket updateStatus(Long id, String status) {
        Ticket t = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        t.setStatus(status);
        return repo.save(t);
    }
}
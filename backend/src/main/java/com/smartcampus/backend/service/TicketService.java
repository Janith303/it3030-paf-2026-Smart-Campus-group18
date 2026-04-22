package com.smartcampus.backend.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.dto.TicketRequestDTO;

public interface TicketService {
    Ticket createTicket(TicketRequestDTO dto);
    Ticket createTicketWithFiles(
            String location,
            String category,
            String description,
            String priority,
            String contact,
            List<MultipartFile> files
    );
    List<Ticket> getAllTickets();
    Ticket getTicketById(Long id);
    Ticket assignTechnician(Long id, String technician);
    Ticket updateStatus(Long id, String status);
}
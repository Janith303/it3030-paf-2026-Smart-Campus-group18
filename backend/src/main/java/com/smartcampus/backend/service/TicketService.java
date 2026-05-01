package com.smartcampus.backend.service;

import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.User;
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
    List<Ticket> getTicketsByUser(User user);
    Ticket saveTicket(Ticket ticket);
    Ticket getTicketById(Long id);
    Ticket assignTechnician(Long id, String technician);
    Ticket assignTechnicianById(Long id, Long technicianId);
    Ticket updateStatus(Long id, String status);
    List<Ticket> getTechnicianTickets(String name);
    List<Ticket> getTechnicianTicketsById(Long technicianId);
    Map<String, Long> getTechnicianStats(String name);
    Ticket addResolution(Long id, String notes);
    void deleteTicket(Long id);
}
package com.smartcampus.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartcampus.backend.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByAssignedTo(String assignedTo);
    List<Ticket> findByAssignedToAndStatus(String assignedTo, String status);
    Ticket findTopByOrderByIdDesc();
    List<Ticket> findByTechnician_Id(Long technicianId);
}
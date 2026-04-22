package com.smartcampus.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartcampus.backend.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}
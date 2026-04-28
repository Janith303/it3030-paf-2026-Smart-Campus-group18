package com.smartcampus.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.smartcampus.backend.model.Activity;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByTicketIdOrderByCreatedAtDesc(Long ticketId);
}
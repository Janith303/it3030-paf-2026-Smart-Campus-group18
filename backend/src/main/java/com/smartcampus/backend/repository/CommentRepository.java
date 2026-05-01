package com.smartcampus.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.smartcampus.backend.model.Comment;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketId(Long ticketId);
}
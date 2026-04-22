package com.smartcampus.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;

import com.smartcampus.backend.model.Comment;
import com.smartcampus.backend.repository.CommentRepository;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepo;

    @Override
    public List<Comment> getComments(Long ticketId) {
        return commentRepo.findByTicketId(ticketId);
    }

    @Override
    public Comment addComment(Long ticketId, String author, String message) {
        Comment c = new Comment();
        c.setTicketId(ticketId);
        c.setAuthor(author);
        c.setMessage(message);
        c.setCreatedAt(LocalDateTime.now());
        return commentRepo.save(c);
    }
}
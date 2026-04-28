package com.smartcampus.backend.service;

import java.util.List;
import com.smartcampus.backend.model.Comment;

public interface CommentService {
    List<Comment> getComments(Long ticketId);
    Comment addComment(Long ticketId, String author, String message);
}
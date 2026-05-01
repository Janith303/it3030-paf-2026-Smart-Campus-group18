package com.smartcampus.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import java.util.List;
import com.smartcampus.backend.model.Activity;
import com.smartcampus.backend.repository.ActivityRepository;

@Service
@Transactional
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityRepository repo;

    @Override
    public void log(Long ticketId, String message, String type) {
        Activity a = new Activity();
        a.setTicketId(ticketId);
        a.setMessage(message);
        a.setType(type);
        a.setCreatedAt(LocalDateTime.now());
        repo.save(a);
    }

    @Override
    public List<Activity> getActivities(Long ticketId) {
        return repo.findByTicketIdOrderByCreatedAtDesc(ticketId);
    }
}
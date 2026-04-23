package com.smartcampus.backend.service;

import java.util.List;
import com.smartcampus.backend.model.Activity;

public interface ActivityService {
    void log(Long ticketId, String message, String type);
    List<Activity> getActivities(Long ticketId);
}
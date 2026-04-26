package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Resource;
import java.util.List;
import java.util.Map;

public interface AnalyticsService {
    List<Object[]> getTopResources(int limit);
    Map<Integer, Long> getPeakHours();
    Long getTotalResourceCount();
    Long getActiveResourceCount();
    Long getOutOfServiceResourceCount();
}
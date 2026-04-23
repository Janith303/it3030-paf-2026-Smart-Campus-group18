package com.smartcampus.backend.controller;

import com.smartcampus.backend.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/top-resources")
    public ResponseEntity<List<Object[]>> getTopResources(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(analyticsService.getTopResources(limit));
    }

    @GetMapping("/peak-hours")
    public ResponseEntity<Map<Integer, Long>> getPeakHours() {
        return ResponseEntity.ok(analyticsService.getPeakHours());
    }

    @GetMapping("/resource-stats")
    public ResponseEntity<Map<String, Long>> getResourceStats() {
        Map<String, Long> stats = Map.of(
                "total", analyticsService.getTotalResourceCount(),
                "active", analyticsService.getActiveResourceCount(),
                "outOfService", analyticsService.getOutOfServiceResourceCount()
        );
        return ResponseEntity.ok(stats);
    }
}
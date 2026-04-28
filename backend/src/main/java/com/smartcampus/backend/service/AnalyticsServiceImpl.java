package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Override
    public List<Object[]> getTopResources(int limit) {
        return bookingRepository.getTopResources(limit);
    }

    @Override
    public Map<Integer, Long> getPeakHours() {
        List<Booking> allBookings = bookingRepository.findAll();
        Map<Integer, Long> hourCounts = new HashMap<>();

        for (Booking booking : allBookings) {
            int hour = booking.getStartTime().getHour();
            hourCounts.put(hour, hourCounts.getOrDefault(hour, 0L) + 1);
        }

        return hourCounts.entrySet().stream()
                .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1,
                        HashMap::new
                ));
    }

    @Override
    public Long getTotalResourceCount() {
        return resourceRepository.count();
    }

    @Override
    public Long getActiveResourceCount() {
        return resourceRepository.findByStatus(ResourceStatus.ACTIVE).stream().count();
    }

    @Override
    public Long getOutOfServiceResourceCount() {
        return resourceRepository.findByStatus(ResourceStatus.OUT_OF_SERVICE).stream().count();
    }
}
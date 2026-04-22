package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.dto.BookingRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;
import java.util.Map;  
import java.util.HashMap;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Booking createBooking(BookingRequestDTO request) {
        boolean hasConflict = bookingRepository.existsOverlappingBooking(
                request.getResourceId(), request.getStartTime(), request.getEndTime());

        if (hasConflict) {
            throw new RuntimeException("Conflict: Resource is already booked for this time range.");
        }

        Booking booking = new Booking();
        booking.setUserId(request.getUserId());
        booking.setResourceId(request.getResourceId());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    @Override
    public Booking updateStatus(Long bookingId, String status, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
        booking.setStatus(newStatus);
        booking.setAdminReason(reason);

        // Innovation feature: Generate QR token on Approval [cite: 119]
        if (newStatus == BookingStatus.APPROVED && booking.getQrToken() == null) {
            booking.setQrToken(UUID.randomUUID().toString());
        }

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public Booking cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);

        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(Long id) {
        // Check if it exists before deleting to avoid errors
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    @Override
    public Map<String, Long> getUserStats(Long userId) {
        List<Object[]> results = bookingRepository.getBookingStatsByUserId(userId);
        Map<String, Long> stats = new HashMap<>();
        
        // Initialize with zeros so the frontend doesn't get 'null'
        stats.put("TOTAL", 0L);
        stats.put("PENDING", 0L);
        stats.put("APPROVED", 0L);
        stats.put("REJECTED", 0L);

        long total = 0;
        for (Object[] result : results) {
            String status = result[0].toString();
            Long count = (Long) result[1];
            stats.put(status, count);
            total += count;
        }
        stats.put("TOTAL", total);
        return stats;
    }

    @Override
    public Booking verifyCheckIn(String token) {
        Booking booking;

        // 1. SMART ROUTING: Check if it's a Short ID or a Full QR Scan
        if (token.length() < 36) {
            // It's a manual entry! Search for tokens starting with these characters
            List<Booking> matches = bookingRepository.findByQrTokenStartingWith(token);
            
            if (matches.isEmpty()) {
                throw new RuntimeException("Invalid Pass ID. No booking found.");
            }
            if (matches.size() > 1) {
                throw new RuntimeException("Multiple matches found. Please scan the full QR code.");
            }
            booking = matches.get(0); // Grab the exact match
            
        } else {
            // It's a full camera scan! Search for the exact UUID
            booking = bookingRepository.findByQrToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid QR Token. No booking found."));
        }

        // 2. Security Validation
        if (booking.getIsCheckedIn()) {
            throw new RuntimeException("Warning: This pass has already been used for check-in!");
        }

        // (Ensure this matches however you defined your status, either Enum or String)
        if (!"APPROVED".equals(booking.getStatus().toString())) { 
            throw new RuntimeException("Error: This booking is not approved.");
        }

        // 3. Mark as checked in
        booking.setIsCheckedIn(true);
        return bookingRepository.save(booking);
    }
}
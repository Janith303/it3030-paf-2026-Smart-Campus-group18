package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import com.smartcampus.backend.model.NotificationType;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.dto.BookingRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;
import java.util.Map;  
import java.util.HashMap;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Member 4 — injected for notifications
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

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

        booking.setResourceName(request.getResourceName()); 
        
        booking.setPurpose(request.getPurpose());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
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

        // Innovation feature: Generate QR token on Approval
        // Innovation feature: Generate QR token on Approval [cite: 119]
        if (newStatus == BookingStatus.APPROVED && booking.getQrToken() == null) {
            booking.setQrToken(UUID.randomUUID().toString());
        }

        Booking saved = bookingRepository.save(booking);

        // Member 4 — Send notification to the booking owner
        Optional<User> userOpt = userRepository.findById(booking.getUserId());
        userOpt.ifPresent(user -> {
            if (newStatus == BookingStatus.APPROVED) {
                notificationService.createNotification(
                    user,
                    "Your booking for \"" + booking.getResourceName() + "\" has been approved!",
                    NotificationType.BOOKING_APPROVED,
                    bookingId
                );
            } else if (newStatus == BookingStatus.REJECTED) {
                notificationService.createNotification(
                    user,
                    "Your booking for \"" + booking.getResourceName() + "\" was rejected. Reason: " + reason,
                    NotificationType.BOOKING_REJECTED,
                    bookingId
                );
            }
        });

        return saved;
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

        Booking saved = bookingRepository.save(booking);

        // Member 4 — Send cancellation notification to the booking owner
        Optional<User> userOpt = userRepository.findById(booking.getUserId());
        userOpt.ifPresent(user -> {
            notificationService.createNotification(
                user,
                "Your booking for \"" + booking.getResourceName() + "\" has been cancelled.",
                NotificationType.BOOKING_CANCELLED,
                bookingId
            );
        });

        return saved;
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

        if (token.length() < 36) {
        if (token.length() < 36) {
            List<Booking> matches = bookingRepository.findByQrTokenStartingWith(token);
            
                throw new RuntimeException("Invalid Pass ID. No booking found.");
            }
            if (matches.size() > 1) {
                throw new RuntimeException("Multiple matches found. Please scan the full QR code.");
            }
            booking = matches.get(0);
            
        } else {
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
        booking.setCheckInTime(java.time.LocalDateTime.now());
        return bookingRepository.save(booking);
    }
}
package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.BookingStatus;
import com.smartcampus.backend.model.NotificationType;
import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.UserRepository;
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
        booking.setResourceName(request.getResourceName());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);

        // Member 4 — notify all admins about the new booking
        Optional<User> bookerOpt = userRepository.findById(request.getUserId());
        String bookerName = bookerOpt.map(User::getName).orElse("A user");
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                admin,
                bookerName + " has requested to book \"" + request.getResourceName() + "\"",
                NotificationType.BOOKING_APPROVED,
                saved.getId()
            );
        }

        return saved;
    }

    @Override
    public Booking updateStatus(Long bookingId, String status, String reason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
        booking.setStatus(newStatus);
        booking.setAdminReason(reason);

        if (newStatus == BookingStatus.APPROVED && booking.getQrToken() == null) {
            booking.setQrToken(UUID.randomUUID().toString());
        }

        Booking saved = bookingRepository.save(booking);

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
    }

    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    @Override
    public Map<String, Long> getUserStats(Long userId) {
        List<Object[]> results = bookingRepository.getBookingStatsByUserId(userId);
        Map<String, Long> stats = new HashMap<>();

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
            List<Booking> matches = bookingRepository.findByQrTokenStartingWith(token);

            if (matches.isEmpty()) {
                throw new RuntimeException("Invalid Pass ID. No booking found.");
            }
            if (matches.size() > 1) {
                throw new RuntimeException("Multiple matches found. Please scan the full QR code.");
            }
            booking = matches.get(0);

        } else {
            booking = bookingRepository.findByQrToken(token)
                    .orElseThrow(() -> new RuntimeException("Invalid QR Token. No booking found."));
        }

        if (booking.getIsCheckedIn()) {
            throw new RuntimeException("Warning: This pass has already been used for check-in!");
        }

        if (!"APPROVED".equals(booking.getStatus().toString())) {
            throw new RuntimeException("Error: This booking is not approved.");
        }

        booking.setIsCheckedIn(true);
        booking.setCheckInTime(java.time.LocalDateTime.now());
        return bookingRepository.save(booking);
    }
}
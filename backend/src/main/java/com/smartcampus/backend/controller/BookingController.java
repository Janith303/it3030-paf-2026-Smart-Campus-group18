package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.dto.BookingRequestDTO;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. Submit a booking request
    @PostMapping
    public ResponseEntity<?> requestBooking(@RequestBody BookingRequestDTO request) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage()); 
        }
    }

    // 2. Get all bookings (Admin view)
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // 3. Get bookings for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    // 4. Get analytics/stats for the dashboard
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Long>> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserStats(userId));
    }

    // 5. Update booking status (Approve/Reject) - This is the one that was duplicated
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status, reason));
    }

    // 6. Cancel a booking
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id, 
            @RequestParam String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }

    // 7. Delete a booking record permanently
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // 8. Verify QR Token and Check-in
    @PatchMapping("/verify")
    public ResponseEntity<?> verifyCheckIn(@RequestParam String token) {
        try {
            return ResponseEntity.ok(bookingService.verifyCheckIn(token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
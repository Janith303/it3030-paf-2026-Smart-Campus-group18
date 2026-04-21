package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.dto.BookingRequestDTO;
import com.smartcampus.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.OPTIONS}) // Crucial for connecting to React
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> requestBooking(@RequestBody BookingRequestDTO request) {
        try {
            return ResponseEntity.ok(bookingService.createBooking(request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage()); 
        }
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status, reason));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable Long id, 
            @RequestParam String reason) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, reason));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookingService.updateStatus(id, status, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build(); // 204 No Content is the standard for successful deletes
    }
}
package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.dto.BookingRequestDTO;
import java.util.List;
import java.util.Map;

public interface BookingService {
    Booking createBooking(BookingRequestDTO request);
    Booking updateStatus(Long bookingId, String status, String reason);
    List<Booking> getAllBookings();
    List<Booking> getBookingsByUserId(Long userId);
    Booking cancelBooking(Long bookingId, String reason);
    void deleteBooking(Long id);
    Map<String, Long> getUserStats(Long userId);
}
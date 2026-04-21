package com.smartcampus.backend.service;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.dto.BookingRequestDTO;
import java.util.List;

public interface BookingService {
    Booking createBooking(BookingRequestDTO request);
    Booking updateStatus(Long bookingId, String status, String reason);
    List<Booking> getAllBookings();
    List<Booking> getBookingsByUserId(Long userId);
}
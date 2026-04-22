package com.smartcampus.backend.repository;


import com.smartcampus.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// MUST have @Repository
@Repository 
// MUST be an interface, and MUST extend JpaRepository
public interface BookingRepository extends JpaRepository<Booking, Long> { 

    List<Booking> findByUserId(Long userId);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
           "FROM Booking b " +
           "WHERE b.resourceId = :resourceId " +
           "AND b.status IN ('PENDING', 'APPROVED') " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
            @Param("resourceId") Long resourceId, 
            @Param("startTime") LocalDateTime startTime, 
            @Param("endTime") LocalDateTime endTime
    );
    @Query("SELECT b.status, COUNT(b) FROM Booking b WHERE b.userId = :userId GROUP BY b.status")
        List<Object[]> getBookingStatsByUserId(@Param("userId") Long userId);

    Optional<Booking> findByQrToken(String qrToken);
    List<Booking> findByQrTokenStartingWith(String prefix);
}
package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
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

    @Query(value = "SELECT b.resource_id, b.resource_name, COUNT(*) as cnt FROM bookings b " +
           "WHERE b.status = 'APPROVED' GROUP BY b.resource_id, b.resource_name ORDER BY cnt DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> getTopResources(@Param("limit") int limit);

    Optional<Booking> findByQrToken(String qrToken);

    List<Booking> findByQrTokenStartingWith(String prefix);
}
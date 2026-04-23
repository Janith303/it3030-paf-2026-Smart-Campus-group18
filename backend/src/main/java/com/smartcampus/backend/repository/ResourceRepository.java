package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {

    List findByType(ResourceType type);

    List findByStatus(ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE " +
           "(:type IS NULL OR r.type = :type) AND " +
           "(:minCapacity IS NULL OR r.capacity >= :minCapacity) AND " +
           "(:location IS NULL OR LOWER(r.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:status IS NULL OR r.status = :status)")
    List searchResources(
        @Param("type") ResourceType type,
        @Param("minCapacity") Integer minCapacity,
        @Param("location") String location,
        @Param("status") ResourceStatus status
    );
}
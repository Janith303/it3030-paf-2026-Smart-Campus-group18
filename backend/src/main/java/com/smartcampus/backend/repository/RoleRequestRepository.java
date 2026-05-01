package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.RoleRequest;
import com.smartcampus.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoleRequestRepository extends JpaRepository<RoleRequest, Long> {
    List<RoleRequest> findByUser(User user);
    List<RoleRequest> findAllByOrderByCreatedAtDesc();
}
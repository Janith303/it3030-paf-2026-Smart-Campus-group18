package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Role;
import com.smartcampus.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Optional<User> findByName(String name);
    List<User> findByRole(Role role);
}
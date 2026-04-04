package com.gigshield.api.repositories;

import com.gigshield.api.models.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, String> {
    List<SupportTicket> findByEmailOrderByCreatedAtDesc(String email);
}

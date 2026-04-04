package com.gigshield.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
@Data
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column()
    private String workerId; // Optional, if they are logged in

    @Column(nullable = false)
    private String status = "OPEN";

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.gigshield.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "workers")
@Data
public class Worker {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false)
    private String platform;

    @Column(nullable = false)
    private String zonePincode;

    @Column(nullable = false)
    private String upiId;

    @Column(nullable = false)
    private LocalDateTime onboardingDate = LocalDateTime.now();
}

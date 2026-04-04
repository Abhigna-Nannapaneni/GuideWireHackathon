package com.gigshield.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
@Data
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String workerId;

    @Column(nullable = false)
    private Double premiumAmount;

    @Column(nullable = false)
    private Double maxPayout;

    @Column(nullable = false)
    private Integer coverageHours;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime endDate;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, CLAIMED, EXPIRED

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

package com.gigshield.api.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Data
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String policyId;

    @Column(nullable = false)
    private String triggerEvent;

    @Column(nullable = false)
    private Double payoutAmount;

    @Column(nullable = false)
    private Integer fraudScore = 0;

    @Column(nullable = false)
    private String status = "PENDING"; // APPROVED, PAID

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

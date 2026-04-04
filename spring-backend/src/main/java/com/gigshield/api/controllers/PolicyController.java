package com.gigshield.api.controllers;

import com.gigshield.api.models.Policy;
import com.gigshield.api.models.Worker;
import com.gigshield.api.repositories.PolicyRepository;
import com.gigshield.api.repositories.WorkerRepository;
import com.gigshield.api.services.RiskEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private RiskEngineService riskEngineService;

    @PostMapping("/purchase")
    public ResponseEntity<?> purchasePolicy(@RequestBody Map<String, String> payload) {
        try {
            String workerId = payload.get("workerId");
            String planLevel = payload.get("planLevel");

            Optional<Worker> workerOpt = workerRepository.findById(workerId);
            if (workerOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Worker not found\"}");
            }

            // Prevent multiple active policies
            List<Policy> existingPolicies = policyRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
            boolean hasActive = existingPolicies.stream().anyMatch(p -> "ACTIVE".equals(p.getStatus()));
            if (hasActive) {
               return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Worker already has an active policy. Cannot purchase another one.\" }");
            }

            Worker worker = workerOpt.get();

            double premiumAmount = 49.0;
            double maxPayout = 1000.0;
            int coverageHours = 16;
            
            if ("BASIC".equals(planLevel)) { premiumAmount = 29.0; maxPayout = 500.0; coverageHours = 8; }
            else if ("PRO".equals(planLevel)) { premiumAmount = 79.0; maxPayout = 2000.0; coverageHours = 30; }

            // Apply AI dynamic pricing
            premiumAmount = riskEngineService.calculatePremium(worker.getZonePincode(), premiumAmount, 120);

            Policy policy = new Policy();
            policy.setWorkerId(workerId);
            policy.setPremiumAmount(premiumAmount);
            policy.setMaxPayout(maxPayout);
            policy.setCoverageHours(coverageHours);
            policy.setStartDate(LocalDateTime.now());
            policy.setEndDate(LocalDateTime.now().plusDays(7));
            policy.setStatus("ACTIVE");
            
            Policy saved = policyRepository.save(policy);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Internal Server Error\"}");
        }
    }

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Policy>> getWorkerPolicies(@PathVariable String workerId) {
        List<Policy> policies = policyRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
        return ResponseEntity.ok(policies);
    }
}

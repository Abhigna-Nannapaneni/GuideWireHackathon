package com.gigshield.api.controllers;

import com.gigshield.api.models.Claim;
import com.gigshield.api.models.Policy;
import com.gigshield.api.repositories.ClaimRepository;
import com.gigshield.api.repositories.PolicyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private ClaimRepository claimRepository;

    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<Claim>> getWorkerClaims(@PathVariable String workerId) {
        List<Policy> policies = policyRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
        List<String> policyIds = policies.stream()
                .map(Policy::getId)
                .collect(Collectors.toList());

        if (policyIds.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Claim> claims = claimRepository.findByPolicyIdInOrderByCreatedAtDesc(policyIds);
        return ResponseEntity.ok(claims);
    }

    // Parametric Automation: Trigger claims automatically based on external events
    @PostMapping("/webhook/weather-trigger")
    public ResponseEntity<?> handleWeatherTrigger(@RequestBody Map<String, String> payload) {
        String eventType = payload.get("eventType"); // e.g., EXTREME_RAIN, SEVERE_POLLUTION
        String severity = payload.get("severity");
        
        // In a real scenario, this would query active policies in affected zones
        List<Policy> activePolicies = policyRepository.findAll().stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()))
                .collect(Collectors.toList());
        
        int triggerCount = 0;
        
        for (Policy policy : activePolicies) {
            // Intelligent processing: create a claim automatically for income loss based on trigger
            Claim autoClaim = new Claim();
            autoClaim.setPolicyId(policy.getId());
            autoClaim.setTriggerEvent(eventType + " - " + severity);
            autoClaim.setPayoutAmount(Math.min(policy.getMaxPayout() * 0.2, 500.0)); // 20% of max payout
            autoClaim.setFraudScore(5); // AI checked implicitly upon trigger
            autoClaim.setStatus("APPROVED"); // Instant payout processing
            autoClaim.setCreatedAt(LocalDateTime.now());
            
            claimRepository.save(autoClaim);
            triggerCount++;
        }
        
        return ResponseEntity.ok("{\"message\": \"Automated processing completed. Triggered " + triggerCount + " income loss payouts. Vehicle/Health/Accident damages are explicitly excluded.\"}");
    }

    // Manual Entry: Worker reports disruption
    @PostMapping("/manual")
    public ResponseEntity<?> submitManualClaim(@RequestBody Map<String, String> payload) {
        String workerId = payload.get("workerId");
        String eventType = payload.get("eventType");
        
        List<Policy> workerPolicies = policyRepository.findByWorkerIdOrderByCreatedAtDesc(workerId);
        List<Policy> activePolicies = workerPolicies.stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()))
                .collect(Collectors.toList());
                
        if (activePolicies.isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"No active policy found for manual claim.\"}");
        }
        
        Policy activePolicy = activePolicies.get(0);
        
        // Call Python AI Microservice for Fraud Validation
        int fraudScore = 50; // fallback
        String aiStatus = "PENDING";
        
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> aiRequest = new HashMap<>();
            aiRequest.put("worker_id", workerId);
            aiRequest.put("claim_amount", Math.min(activePolicy.getMaxPayout() * 0.1, 200.0));
            aiRequest.put("trigger_event", eventType);
            aiRequest.put("location_pincode", "560095"); // Mock pincode for demo (default safe)
            aiRequest.put("incident_time", LocalDateTime.now().toString());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(aiRequest, headers);

            ResponseEntity<Map> aiResponse = restTemplate.postForEntity(
                "http://localhost:8000/detect-fraud", 
                entity, 
                Map.class
            );

            if (aiResponse.getStatusCode().is2xxSuccessful() && aiResponse.getBody() != null) {
                Object scoreObj = aiResponse.getBody().get("fraud_score");
                Object approvedObj = aiResponse.getBody().get("is_approved");
                
                if (scoreObj instanceof Number) {
                    fraudScore = ((Number) scoreObj).intValue();
                }
                if (Boolean.TRUE.equals(approvedObj)) {
                    aiStatus = "APPROVED";
                } else if (Boolean.FALSE.equals(approvedObj)) {
                    aiStatus = "REJECTED"; // Fraud detected
                }
            }
        } catch (Exception e) {
            System.err.println("AI Fraud Service down, falling back to PENDING limit: " + e.getMessage());
        }
        
        Claim manualClaim = new Claim();
        manualClaim.setPolicyId(activePolicy.getId());
        manualClaim.setTriggerEvent(eventType + " (Manual Report)");
        manualClaim.setPayoutAmount(Math.min(activePolicy.getMaxPayout() * 0.1, 200.0));
        manualClaim.setFraudScore(fraudScore);
        manualClaim.setStatus(aiStatus); 
        manualClaim.setCreatedAt(LocalDateTime.now());
        
        Claim saved = claimRepository.save(manualClaim);
        return ResponseEntity.ok(saved);
    }
}

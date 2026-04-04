package com.gigshield.api.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.HashMap;

@Service
public class RiskEngineService {

    private final String AI_SERVICE_URL = "http://localhost:8000";
    private final RestTemplate restTemplate = new RestTemplate();

    public Double calculatePremium(String zonePincode, Double baseRate, Integer ordersPerWeek) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> request = new HashMap<>();
            request.put("worker_id", "temp_id");
            request.put("zone_pincode", zonePincode);
            request.put("base_rate", baseRate);
            request.put("orders_per_week", ordersPerWeek);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                AI_SERVICE_URL + "/calculate-premium", 
                entity, 
                Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Return actual AI-calculated premium
                Object finalPremiumObj = response.getBody().get("final_premium");
                if (finalPremiumObj instanceof Number) {
                    return ((Number) finalPremiumObj).doubleValue();
                }
            }
        } catch (Exception e) {
            System.err.println("AI Service Error, falling back to local defaults: " + e.getMessage());
        }

        // Fallback if AI service is down
        return baseRate;
    }
}

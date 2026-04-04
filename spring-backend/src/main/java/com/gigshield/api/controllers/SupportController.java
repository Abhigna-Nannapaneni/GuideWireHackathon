package com.gigshield.api.controllers;

import com.gigshield.api.models.SupportTicket;
import com.gigshield.api.repositories.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTicket(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String message = payload.get("message");
            String workerId = payload.get("workerId");

            if (email == null || email.trim().isEmpty() || message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("{\"error\": \"Email and Message are required.\"}");
            }

            SupportTicket ticket = new SupportTicket();
            ticket.setEmail(email);
            ticket.setMessage(message);
            ticket.setWorkerId(workerId); // nullable

            SupportTicket saved = supportTicketRepository.save(ticket);
            
            // Return stripped response mapping real DB structure
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", saved.getId(),
                "status", saved.getStatus(),
                "message", "Successfully recorded support request."
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Server execution failed.\"}");
        }
    }
}

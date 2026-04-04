package com.gigshield.api.controllers;

import com.gigshield.api.models.Worker;
import com.gigshield.api.repositories.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.mindrot.jbcrypt.BCrypt;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/workers")
public class WorkerController {

    @Autowired
    private WorkerRepository workerRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerWorker(@RequestBody Worker worker) {
        try {
            if (worker.getName() == null || worker.getPhone() == null || worker.getPassword() == null) {
                return ResponseEntity.badRequest().body("{\"error\": \"Missing required fields\"}");
            }
            
            // Check if exists
            Optional<Worker> existing = workerRepository.findByPhone(worker.getPhone());
            if (existing.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"Phone number already in use\"}");
            }

            // Hash password
            String hashed = BCrypt.hashpw(worker.getPassword(), BCrypt.gensalt());
            worker.setPassword(hashed);

            Worker savedWorker = workerRepository.save(worker);
            savedWorker.setPassword(null); // Don't send hash back
            return ResponseEntity.status(HttpStatus.CREATED).body(savedWorker);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Internal Server Error\"}");
        }
    }

    @GetMapping("/{phone}")
    public ResponseEntity<?> getWorkerByPhone(@PathVariable String phone) {
        Optional<Worker> worker = workerRepository.findByPhone(phone);
        if (worker.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Worker not found\"}");
        }
        return ResponseEntity.ok(worker.get());
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<?> getWorkerById(@PathVariable String id) {
        Optional<Worker> worker = workerRepository.findById(id);
        if (worker.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"Worker not found\"}");
        }
        return ResponseEntity.ok(worker.get());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginWorker(@RequestBody Map<String, String> payload) {
        try {
            String phone = payload.get("phone");
            String password = payload.get("password");

            if (phone == null || password == null) {
                return ResponseEntity.badRequest().body("{\"error\": \"Missing credentials\"}");
            }

            Optional<Worker> workerOpt = workerRepository.findByPhone(phone);
            if (workerOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid credentials\"}");
            }

            Worker worker = workerOpt.get();
            if (BCrypt.checkpw(password, worker.getPassword())) {
                worker.setPassword(null); // hide hash
                return ResponseEntity.ok(worker);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Invalid credentials\"}");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("{\"error\": \"Server error\"}");
        }
    }
}

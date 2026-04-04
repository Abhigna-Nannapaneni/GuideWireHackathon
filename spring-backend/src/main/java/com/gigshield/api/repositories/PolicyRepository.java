package com.gigshield.api.repositories;

import com.gigshield.api.models.Policy;
import com.gigshield.api.models.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, String> {
    List<Policy> findByWorkerIdOrderByCreatedAtDesc(String workerId);
    List<Policy> findByStatus(String status);
}

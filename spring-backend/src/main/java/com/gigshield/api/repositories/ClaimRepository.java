package com.gigshield.api.repositories;

import com.gigshield.api.models.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, String> {
    List<Claim> findByPolicyIdOrderByCreatedAtDesc(String policyId);
    List<Claim> findByPolicyIdInOrderByCreatedAtDesc(List<String> policyIds);
}

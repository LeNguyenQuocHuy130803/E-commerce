package com.example.backend_Ecom.repository;

import com.example.backend_Ecom.entity.Address;
import com.example.backend_Ecom.enums.AddressType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
    boolean existsByUserIdAndIsDefaultTrue(Long userId);
    Optional<Address> findByUserIdAndTypeAndIsDefaultTrue(Long userId, AddressType type);
}

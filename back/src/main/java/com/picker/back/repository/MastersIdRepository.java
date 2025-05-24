package com.picker.back.repository;

import com.picker.back.model.entity.MastersIdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MastersIdRepository extends JpaRepository<MastersIdEntity, String> {
}
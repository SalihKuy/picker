package com.picker.back.repository;

import com.picker.back.model.entity.LegendaryIdEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LegendaryIdRepository extends JpaRepository<LegendaryIdEntity, String> {
}
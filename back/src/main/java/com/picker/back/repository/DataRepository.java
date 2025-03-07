package com.picker.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.picker.back.model.entity.DataEntity;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface DataRepository extends JpaRepository<DataEntity, Long> {
    Optional<DataEntity> findByBattleTime(OffsetDateTime battleTime);
    List<DataEntity> findByMap(String map);
}
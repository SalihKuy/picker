package com.picker.back.repository;

import com.picker.back.model.entity.PlayerNameCacheEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerNameCacheRepository extends JpaRepository<PlayerNameCacheEntry, String> {
}
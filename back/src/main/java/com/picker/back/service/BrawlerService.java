package com.picker.back.service;

import java.time.OffsetDateTime;

import com.picker.back.model.dto.AllStatsDTO;
import com.picker.back.model.dto.BrawlerRequestDTO;
import com.picker.back.model.dto.DoublePlayerDTO;

public interface BrawlerService {
    AllStatsDTO handleBrawlers(BrawlerRequestDTO brawlerRequestDTO);
    DoublePlayerDTO getLeaderboard(String rank, OffsetDateTime dateFilter, Integer minBattles);
    
}

package com.picker.back.service;

import com.picker.back.model.dto.AllStatsDTO;
import com.picker.back.model.dto.BrawlerRequestDTO;

public interface BrawlerService {
    AllStatsDTO handleBrawlers(BrawlerRequestDTO brawlerRequestDTO);
    
}

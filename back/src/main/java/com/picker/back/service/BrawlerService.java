package com.picker.back.service;
import java.util.List;

import com.picker.back.model.dto.BrawlerRequestDTO;
import com.picker.back.model.dto.BrawlerStatsDTO;

public interface BrawlerService {
    List<BrawlerStatsDTO> handleBrawlers(BrawlerRequestDTO brawlerRequestDTO);
    
}

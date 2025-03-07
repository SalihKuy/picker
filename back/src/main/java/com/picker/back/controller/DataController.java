package com.picker.back.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.picker.back.model.dto.BrawlerRequestDTO;
import com.picker.back.model.dto.BrawlerStatsDTO;
import com.picker.back.service.BrawlerService;

import java.util.List;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = "*")
public class DataController {
    
    private final BrawlerService brawlerService;
    private static final Logger logger = LoggerFactory.getLogger(DataController.class);
    
    public DataController(BrawlerService brawlerService) {
        this.brawlerService = brawlerService;
    }
    
    @PostMapping("/brawler")
    public ResponseEntity<List<BrawlerStatsDTO>> predictOutcome(@RequestBody BrawlerRequestDTO request) {
        logger.info("Received request: {}", request);
        
        
        List<BrawlerStatsDTO> response = brawlerService.handleBrawlers(request);
        return ResponseEntity.ok(response);
    }
}
package com.picker.back.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.picker.back.model.dto.AllStatsDTO;
import com.picker.back.model.dto.BrawlerRequestDTO;
import com.picker.back.model.dto.DoublePlayerDTO;
import com.picker.back.model.dto.LeaderboardRequestDTO;
import com.picker.back.service.BrawlerService;

import java.time.OffsetDateTime;     // Import OffsetDateTime
import java.time.ZoneOffset;       // Import ZoneOffset (or ZoneId)

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
    public ResponseEntity<AllStatsDTO> predictOutcome(@RequestBody BrawlerRequestDTO request) {
        logger.info("Received request: {}", request);
        AllStatsDTO response = brawlerService.handleBrawlers(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/leaderboard") // Corrected mapping path - remove leading slash if needed based on base path
    public ResponseEntity<DoublePlayerDTO> getLeaderboard(@RequestBody LeaderboardRequestDTO request) {
        logger.info("Received leaderboard request DTO: {}", request); // Log the received DTO

        // --- Conversion Step ---
        OffsetDateTime actualDateFilter = null;
        if (request.getDateFilter() != null) {
             // Convert LocalDate to OffsetDateTime at the start of the day in UTC
             // Choose the appropriate ZoneOffset or ZoneId (UTC is often safest)
            actualDateFilter = request.getDateFilter()
                                      .atStartOfDay(ZoneOffset.UTC)
                                      .toOffsetDateTime();
            logger.info("Converted LocalDate {} to OffsetDateTime {}", request.getDateFilter(), actualDateFilter);
        } else {
            logger.warn("Received null dateFilter in the request DTO.");
            // Decide how to handle null date - maybe use a default or throw error?
            // For now, passing null to service if it was null in request.
        }


        // Call the service with the converted OffsetDateTime
        DoublePlayerDTO response = brawlerService.getLeaderboard(
            request.getRank(),
            actualDateFilter, // Pass the converted value
            request.getMinBattles()
        );
        return ResponseEntity.ok(response);
    }
}
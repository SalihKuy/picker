package com.picker.back.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Comparator;
import org.springframework.stereotype.Service;

import com.picker.back.model.dto.BrawlerRequestDTO;
import com.picker.back.model.dto.BrawlerStatsDTO;
import com.picker.back.model.entity.DataEntity;
import com.picker.back.repository.DataRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class BrawlerServiceImpl implements BrawlerService {
    
    private DataRepository dataRepository;
    private static final Logger logger = LoggerFactory.getLogger(BrawlerServiceImpl.class);
    private static final int MIN_MATCH_COUNT = 25;

    public BrawlerServiceImpl(DataRepository dataRepository) {
        this.dataRepository = dataRepository;
        logger.info("BrawlerServiceImpl initialized");
    }
    
    @Override
    public List<BrawlerStatsDTO> handleBrawlers(BrawlerRequestDTO brawlerRequestDTO) {
        logger.info("handleBrawlers called with request: {}", brawlerRequestDTO);
        
        String map = brawlerRequestDTO.getMap();
        List<String> blueBrawlers = brawlerRequestDTO.getBlueBrawlers();
        List<String> redBrawlers = brawlerRequestDTO.getRedBrawlers();
        
        logger.debug("Processing map: {}", map);
        logger.debug("Blue brawlers: {}", blueBrawlers);
        logger.debug("Red brawlers: {}", redBrawlers);
        
        if(map != null && !map.isEmpty() && 
           (blueBrawlers == null || areAllEmpty(blueBrawlers)) && 
           (redBrawlers == null || areAllEmpty(redBrawlers))) {
            logger.info("Map-only request detected, delegating to handleMapOnly for map: {}", map);
            return handleMapOnly(map);
        } 
    
        logger.info("Full team composition request detected, returning default result for now");
        return List.of(new BrawlerStatsDTO("Brawler 1", 0.0, 0));
    }

    public List<BrawlerStatsDTO> handleMapOnly(String map) {
        logger.info("handleMapOnly called for map: {}", map);
        
        List<DataEntity> battles = dataRepository.findByMap(map);
        logger.info("Found {} battles for map: {}", battles.size(), map);
        
        Map<String, int[]> brawlerStats = new HashMap<>();
        
        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
            processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
            processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
            
            processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
            processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
            processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
        }
        
        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());
        
        List<BrawlerStatsDTO> result = brawlerStats.entrySet().stream()
            .filter(entry -> {
                int total = entry.getValue()[1];
                boolean hasEnoughMatches = total >= MIN_MATCH_COUNT;
                if (!hasEnoughMatches) {
                    logger.debug("Filtered out brawler {} with only {} matches (minimum required: {})", 
                               entry.getKey(), total, MIN_MATCH_COUNT);
                }
                return hasEnoughMatches;
            })
            .map(entry -> {
                String brawler = entry.getKey();
                int[] stats = entry.getValue();
                int wins = stats[0];
                int total = stats[1];
                double winRate = total > 0 ? (double) wins / total : 0.0;
                
                logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}", 
                           brawler, wins, total, winRate);
                
                return new BrawlerStatsDTO(brawler, winRate, total);
            })
            .sorted(Comparator.comparing(BrawlerStatsDTO::getWinRate).reversed()).toList();
        
        logger.info("Returning {} brawler statistics after filtering (minimum {} matches required)", 
                  result.size(), MIN_MATCH_COUNT);
        return result;
    }
    
    private void processBrawler(Map<String, int[]> brawlerStats, String brawler, boolean isWinner, boolean isTwoOh) {
        if (brawler == null || brawler.isEmpty()) {
            logger.trace("Skipping null or empty brawler");
            return;
        }
        
        brawlerStats.computeIfAbsent(brawler, k -> new int[2]);
        int[] stats = brawlerStats.get(brawler);
        
        if (isWinner) {
            stats[0] += 2;
            logger.trace("Added win for brawler: {}", brawler);
        } else {
            if(isTwoOh) {
                stats[0] += 1;
            }
            logger.trace("Added loss for brawler: {}", brawler);
        }
        if(isTwoOh) {
            stats[1] += 2;
        } else {
            stats[1] += 3;
        }
    }
    
    private boolean areAllEmpty(List<String> list) {
        if (list == null || list.isEmpty()) {
            return true;
        }
        
        return list.stream().allMatch(str -> str == null || str.isEmpty());
    }
}
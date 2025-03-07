package com.picker.back.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.picker.back.model.dto.ApiResponseDTO;
import com.picker.back.model.dto.ApiResponseDTO.Item;
import com.picker.back.model.dto.ApiResponseDTO.Player;
import com.picker.back.model.entity.DataEntity;
import com.picker.back.repository.DataRepository;
import com.picker.back.service.ApiService;
import com.picker.back.service.DataService;
import com.picker.back.util.FileUtil;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class DataFetchScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DataFetchScheduler.class);

    private final ApiService apiService;
    private final DataService dataService;
    private final DataRepository dataRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public DataFetchScheduler(ApiService apiService, DataService dataService, DataRepository dataRepository) {
        this.apiService = apiService;
        this.dataService = dataService;
        this.dataRepository = dataRepository;
    }

    @Scheduled(fixedRateString = "${scheduler.fixedRate}", initialDelayString = "${scheduler.initialDelay}")
    public void scheduleFetchDataTasks() {
        logger.info("Scheduled task started");

        try {
            List<String> playerTags = FileUtil.readPlayerTagsFromFile("ids.txt");
            if (!playerTags.isEmpty()) {
                fetchDataAndSave(playerTags.get(0));

                for (int i = 1; i < playerTags.size(); i++) {
                    String playerTag = playerTags.get(i);
                    scheduler.schedule(() -> fetchDataAndSave(playerTag), (1000000 / playerTags.size()) * (long) i,
                            TimeUnit.MILLISECONDS);
                }
            }
        } catch (Exception e) {
            logger.error("Error reading player tags from file", e);
        }
    }

    public void fetchDataAndSave(String playerTag) {
        logger.info("Fetching data for player tag: {}", playerTag);

        ApiResponseDTO response = apiService.getApiResponse(playerTag);
        if (response != null && response.getItems() != null && !response.getItems().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss.SSSX");
            for (int i = 0; i < response.getItems().size(); i++) {
                Item item = response.getItems().get(i);
                OffsetDateTime battleTime = OffsetDateTime.parse(item.getBattleTime(), formatter);
                if (!item.getBattle().getType().equals("soloRanked")) {
                    continue;
                }

                if (item.getBattle().getStarPlayer() == null) {
                    continue;
                }

                if (dataRepository.findByBattleTime(battleTime).isPresent()) {
                    continue;
                }

                List<List<Player>> teams = item.getBattle().getTeams();
                if (teams.get(1).get(0).getTag().toLowerCase().equalsIgnoreCase(playerTag) || teams.get(1).get(1).getTag().toLowerCase().equalsIgnoreCase(playerTag) || teams.get(1).get(2).getTag().toLowerCase().equalsIgnoreCase(playerTag)) {

                    logger.info("Player is on Team 2, swapping team positions for correct processing");
                    List<Player> temp = teams.get(0);
                    teams.set(0, teams.get(1));
                    teams.set(1, temp);
                }

                if (i + 2 < response.getItems().size() &&
                !response.getItems().get(i + 2).getBattle().getResult().equals(response.getItems().get(i + 1).getBattle().getResult()) &&
                        item.getBattle().getResult().equals("victory")) {
                    DataEntity dataEntity = new DataEntity(
                            item.getEvent().getMap(),
                            item.getBattle().getMode(),
                            item.getBattle().getTeams().get(0).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(2).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(2).getBrawler().getName(),
                            false,
                            battleTime);
                    dataService.saveData(dataEntity);
                    logger.info("Data saved to database for item {}", i);
                }

                else if (i + 2 < response.getItems().size() &&
                !response.getItems().get(i + 2).getBattle().getResult().equals(response.getItems().get(i + 1).getBattle().getResult()) &&
                        item.getBattle().getResult().equals("defeat")) {
                    DataEntity dataEntity = new DataEntity(
                            item.getEvent().getMap(),
                            item.getBattle().getMode(),
                            item.getBattle().getTeams().get(1).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(2).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(2).getBrawler().getName(),
                            false,
                            battleTime);
                    dataService.saveData(dataEntity);
                    logger.info("Data saved to database for item {}", i);
                }
                else if (item.getBattle().getResult().equals("victory")) {
                    DataEntity dataEntity = new DataEntity(
                            item.getEvent().getMap(),
                            item.getBattle().getMode(),
                            item.getBattle().getTeams().get(0).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(2).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(2).getBrawler().getName(),
                            true,
                            battleTime);
                    dataService.saveData(dataEntity);
                    logger.info("Data saved to database for item {}", i);
                }
                else {
                    DataEntity dataEntity = new DataEntity(
                            item.getEvent().getMap(),
                            item.getBattle().getMode(),
                            item.getBattle().getTeams().get(1).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(1).get(2).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(0).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(1).getBrawler().getName(),
                            item.getBattle().getTeams().get(0).get(2).getBrawler().getName(),
                            true,
                            battleTime);
                    dataService.saveData(dataEntity);
                    logger.info("Data saved to database for item {}", i);
                }
            }
        } else {
            logger.warn("No items found in API response");
        }
    }
}
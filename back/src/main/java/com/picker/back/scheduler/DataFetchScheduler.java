package com.picker.back.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.picker.back.model.dto.ApiResponseDTO;
import com.picker.back.model.dto.ApiResponseDTO.Item;
import com.picker.back.model.dto.ApiResponseDTO.Player;
import com.picker.back.model.entity.DataEntity;
import com.picker.back.model.entity.LegendaryIdEntity;
import com.picker.back.model.entity.MastersIdEntity;
import com.picker.back.repository.DataRepository;
import com.picker.back.repository.LegendaryIdRepository;
import com.picker.back.repository.MastersIdRepository;
import com.picker.back.service.ApiService;
import com.picker.back.service.DataService;
import com.picker.back.service.PlayerIdManagementService;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Component
public class DataFetchScheduler {

    private static final Logger logger = LoggerFactory.getLogger(DataFetchScheduler.class);

    private final ApiService apiService;
    private final DataService dataService;
    private final PlayerIdManagementService playerIdManagementService;
    private final DataRepository dataRepository;
    private final LegendaryIdRepository legendaryIdRepository;
    private final MastersIdRepository mastersIdRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private boolean start = true; // debug variable

    public DataFetchScheduler(ApiService apiService, DataService dataService, DataRepository dataRepository,
            LegendaryIdRepository legendaryIdRepository, MastersIdRepository mastersIdRepository,
            PlayerIdManagementService playerIdManagementService) {
        this.apiService = apiService;
        this.dataService = dataService;
        this.dataRepository = dataRepository;
        this.legendaryIdRepository = legendaryIdRepository;
        this.mastersIdRepository = mastersIdRepository;
        this.playerIdManagementService = playerIdManagementService;
    }

    @Scheduled(fixedRateString = "${scheduler.fixedRate}", initialDelayString = "${scheduler.initialDelay}")
    public void scheduleFetchDataTasks() {
        if (!start) {
            return;
        }
        logger.info("Scheduled task started");

        try {
            List<String> legendaryPlayerTags = legendaryIdRepository.findAll()
                    .stream()
                    .map(LegendaryIdEntity::getPlayerTag)
                    .collect(Collectors.toList());

            List<String> mastersPlayerTags = mastersIdRepository.findAll()
                    .stream()
                    .map(MastersIdEntity::getPlayerTag)
                    .collect(Collectors.toList());

            Set<String> combinedPlayerTagsSet = new HashSet<>(legendaryPlayerTags);
            combinedPlayerTagsSet.addAll(mastersPlayerTags);
            List<String> playerTags = new ArrayList<>(combinedPlayerTagsSet);

            if (!playerTags.isEmpty()) {
                logger.info("Found {} player tags from repositories to process.", playerTags.size());
                fetchDataAndSave(playerTags.get(0));
                for (int i = 1; i < playerTags.size(); i++) {
                    String playerTag = playerTags.get(i);
                    long delay = (3600000L / playerTags.size()) * i;
                    scheduler.schedule(() -> fetchDataAndSave(playerTag), delay, TimeUnit.MILLISECONDS);
                }
            } else {
                logger.info("No player tags found in repositories to process.");
            }
        } catch (Exception e) {
            logger.error("Error fetching player tags from repositories or scheduling tasks", e);
        }
    }

    public void fetchDataAndSave(String playerTag) {
        logger.info("Fetching data for player tag: {}", playerTag);

        ApiResponseDTO response = apiService.getApiResponse(playerTag);
        if (response != null && response.getItems() != null && !response.getItems().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss.SSSX");
            for (int i = 0; i < response.getItems().size(); i++) {
                Item item = response.getItems().get(i);
                if (!item.getBattle().getType().equals("soloRanked")) {
                    continue;
                }

                if (item.getBattle().getStarPlayer() == null) {
                    continue;
                }

                if (item.getBattle().getStarPlayer() != null) {

                    OffsetDateTime battleTime = OffsetDateTime.parse(item.getBattleTime(), formatter);
                    if (dataRepository.findByBattleTime(battleTime).isPresent()) {
                        continue;
                    }

                    boolean isTwoOhMatch = false;
                    if (i + 1 < response.getItems().size()) {
                        Item previousBattle = response.getItems().get(i + 1);
                        if (item.getBattle().getResult().equals(previousBattle.getBattle().getResult()) &&
                                previousBattle.getBattle().getStarPlayer() == null) {
                            isTwoOhMatch = true;
                        }
                    } else {
                        logger.warn(
                                "Star player found at index {} but no preceding battle item found. Cannot determine if 2-0.",
                                i);
                    }

                    List<List<Player>> teams = item.getBattle().getTeams();
                    Integer highestTrophies = 0;
                    boolean playerOnTeam2 = false;
                    List<String> battleTags = new ArrayList<>();
                    List<String> battleTags2 = new ArrayList<>();

                    for (Player player : teams.get(1)) {
                        if (player.getBrawler().getTrophies() > highestTrophies) {
                            highestTrophies = player.getBrawler().getTrophies();
                        }
                        if (player.getBrawler().getTrophies() > 18 && player.getBrawler().getTrophies() < 23) {
                            battleTags.add(player.getTag());
                        } else if (player.getBrawler().getTrophies() > 15 && player.getBrawler().getTrophies() < 23) {
                            battleTags2.add(player.getTag());
                        }
                        if (player.getTag().equalsIgnoreCase(playerTag)) {
                            playerOnTeam2 = true;
                        }
                    }

                    for (Player player : teams.get(0)) {
                        if (player.getBrawler().getTrophies() > highestTrophies) {
                            highestTrophies = player.getBrawler().getTrophies();
                        }
                        if (player.getBrawler().getTrophies() > 18 && player.getBrawler().getTrophies() < 23) {
                            battleTags.add(player.getTag());
                        } else if (player.getBrawler().getTrophies() > 15 && player.getBrawler().getTrophies() < 23) {
                            battleTags2.add(player.getTag());
                        }
                    }
                    if (highestTrophies > 22 || highestTrophies < 16) {
                        return;
                    }
                    if (playerOnTeam2) {
                        logger.info("Player {} is on Team 2, swapping team positions.", playerTag);
                        List<Player> temp = teams.get(0);
                        teams.set(0, teams.get(1));
                        teams.set(1, temp);
                    }

                    try {
                        battleTags.forEach(tag -> {
                            logger.info("Managing player tag: {}", tag);
                            playerIdManagementService.managePlayerId(tag, true);
                            logger.info("Player tag {} managed successfully", tag);
                        });
                        battleTags2.forEach(tag -> {
                            logger.info("Managing player tag: {}", tag);
                            playerIdManagementService.managePlayerId(tag, false);
                            logger.info("Player tag {} managed successfully", tag);
                        });
                    } catch (Exception e) {
                        logger.error("Error processing player tags for battle at {}", battleTime, e);
                    }

                    List<Player> winningTeam;
                    List<Player> losingTeam;

                    if (item.getBattle().getResult().equalsIgnoreCase("victory")) {
                        winningTeam = teams.get(0);
                        losingTeam = teams.get(1);
                    } else {
                        winningTeam = teams.get(1);
                        losingTeam = teams.get(0);
                    }

                    if (winningTeam != null && winningTeam.size() == 3 && losingTeam != null
                            && losingTeam.size() == 3) {
                        DataEntity dataEntity = new DataEntity(
                                item.getEvent().getMap(),
                                item.getBattle().getMode(),
                                winningTeam.get(0).getBrawler().getName(),
                                winningTeam.get(1).getBrawler().getName(),
                                winningTeam.get(2).getBrawler().getName(),
                                losingTeam.get(0).getBrawler().getName(),
                                losingTeam.get(1).getBrawler().getName(),
                                losingTeam.get(2).getBrawler().getName(),
                                isTwoOhMatch,
                                battleTime,
                                highestTrophies,
                                winningTeam.get(0).getTag(),
                                winningTeam.get(1).getTag(),
                                winningTeam.get(2).getTag(),
                                losingTeam.get(0).getTag(),
                                losingTeam.get(1).getTag(),
                                losingTeam.get(2).getTag());
                        dataService.saveData(dataEntity);
                        logger.info("Data saved for match ending {}. PlayerTag: {}, isTwoOh: {}", battleTime, playerTag,
                                isTwoOhMatch);
                    } else {
                        logger.warn(
                                "Skipping save for battle at {}. Invalid team sizes after processing. Winning: {}, Losing: {}",
                                battleTime,
                                winningTeam != null ? winningTeam.size() : "null",
                                losingTeam != null ? losingTeam.size() : "null");
                    }
                }
            }
        } else {
            logger.warn("No items found in API response");
        }
    }
}
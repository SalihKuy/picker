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

        if (map != null && !map.isEmpty() &&
                (blueBrawlers == null || areAllEmpty(blueBrawlers)) &&
                (redBrawlers == null || areAllEmpty(redBrawlers))) {
            logger.info("Map-only request detected, delegating to handleMapOnly for map: {}", map);
            return handleMapOnly(map);
        } else if (map != null && !map.isEmpty() &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 1 &&
                (blueBrawlers == null || areAllEmpty(blueBrawlers))) {
            logger.info("1 red request detected, delegating to handle1Red for map: {} and brawler: {}", map,
                    redBrawlers.get(0));
            return handle1Red(map, redBrawlers.get(0));
        } else if (map != null && !map.isEmpty() &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 1 &&
                (blueBrawlers != null || countNonEmptyStrings(blueBrawlers) == 1)) {
            logger.info(
                    "1 red, 1 blue request detected, delegating to handle1Red1Blue for map: {} and brawlers: {} and {}",
                    map, redBrawlers.get(0), blueBrawlers.get(0));
            return handle1Red1Blue(map, redBrawlers.get(0), blueBrawlers.get(0));
        } else if (map != null && blueBrawlers != null && countNonEmptyStrings(blueBrawlers) == 1 &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 2) {
            logger.info("2 red, 1 blue request detected, delegating to handle2Red1Blue");
            List<String> nonEmptyRedBrawlers = redBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();
            return handle2Red1Blue(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1), blueBrawlers.get(0));
        } else if (map != null && blueBrawlers != null && countNonEmptyStrings(blueBrawlers) == 2 &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 2) {
            logger.info("2 red, 2 blue request detected, delegating to handle2Red2Blue");
            List<String> nonEmptyRedBrawlers = redBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();
            List<String> nonEmptyBlueBrawlers = blueBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();
            return handle2Red2Blue(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1),
                    nonEmptyBlueBrawlers.get(0), nonEmptyBlueBrawlers.get(1));
        } else if (map != null && blueBrawlers != null && countNonEmptyStrings(blueBrawlers) == 2 &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 3) {
            logger.info("2 red, 2 blue request detected, delegating to handle3Red2Blue");
            List<String> nonEmptyRedBrawlers = redBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();
            List<String> nonEmptyBlueBrawlers = blueBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();
            return handle3Red2Blue(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1),
                    nonEmptyRedBrawlers.get(2),
                    nonEmptyBlueBrawlers.get(0), nonEmptyBlueBrawlers.get(1));
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

    public List<BrawlerStatsDTO> handle1Red(String map, String brawler1) {
        logger.info("handleMapOnly called for map: {}", map);

        List<DataEntity> battles = dataRepository.findBy1RedAndMap(map, brawler1);
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
        brawlerStats.remove(brawler1);

        List<BrawlerStatsDTO> result = brawlerStats.entrySet().stream()
                .filter(entry -> {
                    int total = entry.getValue()[1];
                    boolean hasEnoughMatches = total >= 5;
                    if (!hasEnoughMatches) {
                        logger.debug("Filtered out brawler {} with only {} matches (minimum required: {})",
                                entry.getKey(), total, 5);
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

    public List<BrawlerStatsDTO> handle1Red1Blue(String map, String brawler1, String brawler2) {
        logger.info("handleMapOnly called for map: {}", map);

        List<DataEntity> battles = dataRepository.findBy1RedAndMap(map, brawler1);
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

        List<DataEntity> newBattles = dataRepository.findBy1Red1BlueAndMap(map, brawler1, brawler2);
        logger.info("Found {} battles:", battles.size());
        newBattles.forEach(battle -> {
            logger.info("Battle ID: {}, Map: {}, Blue: {} {} {}, Red: {} {} {}, TwoOh: {}",
                    battle.getId(),
                    battle.getMap(),
                    battle.getBlueBrawler1(), battle.getBlueBrawler2(), battle.getBlueBrawler3(),
                    battle.getRedBrawler1(), battle.getRedBrawler2(), battle.getRedBrawler3(),
                    battle.getIsTwoOh());
        });
        logger.info("Found {} battles for map: {}", newBattles.size(), map);
        for (DataEntity battle : newBattles) {
            logger.trace("Processing battle with ID: {}", battle.getId());

            boolean redAndBlueHasBrawlers = (battle.getRedBrawler1().equals(brawler1)
                    || battle.getRedBrawler2().equals(brawler1) || battle.getRedBrawler3().equals(brawler1)) &&
                    (battle.getBlueBrawler1().equals(brawler2) || battle.getBlueBrawler2().equals(brawler2)
                            || battle.getBlueBrawler3().equals(brawler2));

            if (redAndBlueHasBrawlers) {
                String team = battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " "
                        + battle.getBlueBrawler3() + " VS " + battle.getRedBrawler1() + " " + battle.getRedBrawler2()
                        + " " + battle.getRedBrawler3();
                processTeam(brawlerStats, team, redAndBlueHasBrawlers);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(brawlerStats, team, false);
            }
        }

        brawlerStats.remove(brawler1);

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<BrawlerStatsDTO> result = brawlerStats.entrySet().stream()
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

    public List<BrawlerStatsDTO> handle2Red1Blue(String map, String brawler1, String brawler2, String brawler3) {
        logger.info("handleMapOnly called for map: {}", map);

        List<DataEntity> battles = dataRepository.findBy2RedAndMap(map, brawler1, brawler2);
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

        List<DataEntity> newBattles = dataRepository.findBy2Red1BlueAndMap(map, brawler1, brawler2, brawler3);
        logger.info("Found {} battles for map: {}", newBattles.size(), map);
        for (DataEntity battle : newBattles) {
            logger.trace("Processing battle with ID: {}", battle.getId());

            boolean redHasBothTargetBrawlers = (battle.getRedBrawler1().equals(brawler1)
                    || battle.getRedBrawler2().equals(brawler1) || battle.getRedBrawler3().equals(brawler1)) &&
                    (battle.getRedBrawler1().equals(brawler2) || battle.getRedBrawler2().equals(brawler2)
                            || battle.getRedBrawler3().equals(brawler2));

            if (redHasBothTargetBrawlers) {
                String team = battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " "
                        + battle.getBlueBrawler3() + " VS " + battle.getRedBrawler1() + " " + battle.getRedBrawler2()
                        + " " + battle.getRedBrawler3();
                processTeam(brawlerStats, team, true);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(brawlerStats, team, false);
            }
        }

        brawlerStats.remove(brawler1);
        brawlerStats.remove(brawler2);

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<BrawlerStatsDTO> result = brawlerStats.entrySet().stream()
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

    public List<BrawlerStatsDTO> handle2Red2Blue(String map, String brawler1, String brawler2, String brawler3,
            String brawler4) {
        logger.info("handleMapOnly called for map: {}", map);

        List<DataEntity> battles = dataRepository.findBy2RedAndMap(map, brawler1, brawler2);
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

        List<DataEntity> newBattles = dataRepository.findBy2Red2BlueAndMap(map, brawler1, brawler2, brawler3, brawler4);
        logger.info("Found {} battles for map: {}", newBattles.size(), map);
        for (DataEntity battle : newBattles) {
            logger.trace("Processing battle with ID: {}", battle.getId());

            boolean redHasBothTargetBrawlers = (battle.getRedBrawler1().equals(brawler1)
                    || battle.getRedBrawler2().equals(brawler1) || battle.getRedBrawler3().equals(brawler1)) &&
                    (battle.getRedBrawler1().equals(brawler2) || battle.getRedBrawler2().equals(brawler2)
                            || battle.getRedBrawler3().equals(brawler2));

            if (redHasBothTargetBrawlers) {
                String team = battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " "
                        + battle.getBlueBrawler3() + " VS " + battle.getRedBrawler1() + " " + battle.getRedBrawler2()
                        + " " + battle.getRedBrawler3();
                processTeam(brawlerStats, team, true);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(brawlerStats, team, false);
            }
        }

        brawlerStats.remove(brawler1);
        brawlerStats.remove(brawler2);

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<BrawlerStatsDTO> result = brawlerStats.entrySet().stream()
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

    public List<BrawlerStatsDTO> handle3Red2Blue(String map, String brawler1, String brawler2, String brawler3,
            String brawler4, String brawler5) {
        logger.info("handleMapOnly called for map: {}", map);

        List<DataEntity> battles = dataRepository.findBy3RedAndMap(map, brawler1, brawler2, brawler3);
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

        List<DataEntity> newBattles = dataRepository.findBy3Red2BlueAndMap(map, brawler1, brawler2, brawler3, brawler4, brawler5);
        logger.info("Found {} battles for map: {}", newBattles.size(), map);
        for (DataEntity battle : newBattles) {
            logger.trace("Processing battle with ID: {}", battle.getId());

            boolean redHasAllTargetBrawlers = (battle.getRedBrawler1().equals(brawler1)
                    || battle.getRedBrawler2().equals(brawler1) || battle.getRedBrawler3().equals(brawler1)) &&
                    (battle.getRedBrawler1().equals(brawler2) || battle.getRedBrawler2().equals(brawler2)
                            || battle.getRedBrawler3().equals(brawler2) && battle.getRedBrawler1().equals(brawler3)
                            || battle.getRedBrawler2().equals(brawler3) || battle.getRedBrawler3().equals(brawler3));

            if (redHasAllTargetBrawlers) {
                String team = battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " "
                        + battle.getBlueBrawler3() + " VS " + battle.getRedBrawler1() + " " + battle.getRedBrawler2()
                        + " " + battle.getRedBrawler3();
                processTeam(brawlerStats, team, true);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(brawlerStats, team, false);
            }
        }

        brawlerStats.remove(brawler1);
        brawlerStats.remove(brawler2);
        brawlerStats.remove(brawler3);

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<BrawlerStatsDTO> result = brawlerStats.entrySet().stream()
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
            if (isTwoOh) {
                stats[0] += 1;
            }
            logger.trace("Added loss for brawler: {}", brawler);
        }
        if (isTwoOh) {
            stats[1] += 2;
        } else {
            stats[1] += 3;
        }
    }

    private void processTeam(Map<String, int[]> brawlerStats, String brawler, boolean isWinner) {
        if (brawler == null || brawler.isEmpty()) {
            logger.trace("Skipping null or empty brawler");
            return;
        }

        brawlerStats.computeIfAbsent(brawler, k -> new int[2]);
        int[] stats = brawlerStats.get(brawler);

        if (isWinner) {
            stats[0]++;
            logger.trace("Added win for brawler: {}", brawler);
        }
        stats[1]++;
    }

    private boolean areAllEmpty(List<String> list) {
        if (list == null || list.isEmpty()) {
            return true;
        }

        return list.stream().allMatch(str -> str == null || str.isEmpty());
    }

    private int countNonEmptyStrings(List<String> list) {
        if (list == null) {
            return 0;
        }
        return (int) list.stream().filter(str -> str != null && !str.isEmpty()).count();
    }
}
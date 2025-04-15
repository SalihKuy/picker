package com.picker.back.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.stereotype.Service;

import com.picker.back.model.dto.AllStatsDTO;
import com.picker.back.model.dto.BrawlerRequestDTO;
import com.picker.back.model.dto.StatsDTO;
import com.picker.back.model.entity.DataEntity;
import com.picker.back.repository.DataRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class BrawlerServiceImpl implements BrawlerService {

    private DataRepository dataRepository;
    private static final Logger logger = LoggerFactory.getLogger(BrawlerServiceImpl.class);

    public BrawlerServiceImpl(DataRepository dataRepository) {
        this.dataRepository = dataRepository;
        logger.info("BrawlerServiceImpl initialized");
    }

    @Override
    public AllStatsDTO handleBrawlers(BrawlerRequestDTO brawlerRequestDTO) {
        logger.info("handleBrawlers called with request: {}", brawlerRequestDTO);
        String map = brawlerRequestDTO.getMap();
        List<String> blueBrawlers = brawlerRequestDTO.getBlueBrawlers();
        List<String> redBrawlers = brawlerRequestDTO.getRedBrawlers();
        Integer trophies = brawlerRequestDTO.getTrophies();
        boolean bluesIncluded = brawlerRequestDTO.isBluesIncluded();
        List<String> nonEmptyRedBrawlers = redBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();
        List<String> nonEmptyBlueBrawlers = blueBrawlers.stream().filter(b -> b != null && !b.isEmpty()).toList();

        logger.debug("Processing map: {}", map);
        logger.debug("Blue brawlers: {}", blueBrawlers);
        logger.debug("Red brawlers: {}", redBrawlers);
        logger.debug("Trophies: {}", trophies);
        logger.debug("No map: {}", (map == null || map.isEmpty()));
        logger.debug("Blues included: {}", bluesIncluded);

        if ((map == null || map.isEmpty()) && (blueBrawlers == null || areAllEmpty(blueBrawlers)) &&
                (redBrawlers == null || areAllEmpty(redBrawlers))) {
            logger.info("No parameters");
            return handleNothing(trophies);
        }

        if (map != null && !map.isEmpty() &&
                (blueBrawlers == null || areAllEmpty(blueBrawlers)) &&
                (redBrawlers == null || areAllEmpty(redBrawlers))) {
            logger.info("Map-only request detected, delegating to handleMapOnly for map: {}", map);
            return handleMapOnly(map);
        } else if (redBrawlers != null && countNonEmptyStrings(redBrawlers) == 1 &&
                (blueBrawlers == null || areAllEmpty(blueBrawlers))) {
            logger.info("1 red request detected, delegating to handle1Red for map: {} and brawler: {}", map,
                    redBrawlers.get(0));
            return handle1Red(map, redBrawlers.get(0), trophies);
        } else if (redBrawlers != null && countNonEmptyStrings(redBrawlers) == 1 &&
                (blueBrawlers != null || countNonEmptyStrings(blueBrawlers) == 1)) {
            logger.info(
                    "1 red, 1 blue request detected, delegating to handle1Red1Blue for map: {} and brawlers: {} and {}",
                    map, redBrawlers.get(0), blueBrawlers.get(0));
            return handle1Red1Blue(map, redBrawlers.get(0), blueBrawlers.get(0), trophies, bluesIncluded);
        } else if (countNonEmptyStrings(blueBrawlers) == 1 &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 2) {
            logger.info("2 red, 1 blue request detected, delegating to handle2Red1Blue");
            return handle2Red1Blue(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1), blueBrawlers.get(0),
                    trophies, bluesIncluded);
        } else if (countNonEmptyStrings(blueBrawlers) == 2 &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 2) {
            logger.info("2 red, 2 blue request detected, delegating to handle2Red2Blue");
            return handle2Red2Blue(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1),
                    nonEmptyBlueBrawlers.get(0), nonEmptyBlueBrawlers.get(1), trophies, bluesIncluded);
        } else if (countNonEmptyStrings(blueBrawlers) == 2 &&
                redBrawlers != null && countNonEmptyStrings(redBrawlers) == 3) {
            logger.info("2 red, 2 blue request detected, delegating to handle3Red2Blue");
            return handle3Red2Blue(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1),
                    nonEmptyRedBrawlers.get(2),
                    nonEmptyBlueBrawlers.get(0), nonEmptyBlueBrawlers.get(1), trophies, bluesIncluded);
        } else if (countNonEmptyStrings(blueBrawlers) == 0 && redBrawlers != null
                && countNonEmptyStrings(redBrawlers) == 2) {
            logger.info("2 red request detected, delegating to handle2Red");
            return handle2Red(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1), trophies);
        } else if (countNonEmptyStrings(blueBrawlers) == 0 && redBrawlers != null
                && countNonEmptyStrings(redBrawlers) == 3) {
            logger.info("3 red request detected, delegating to handle3Red");
            return handle3Red(map, nonEmptyRedBrawlers.get(0), nonEmptyRedBrawlers.get(1),
                    nonEmptyRedBrawlers.get(2), trophies);
        }

        logger.info("Full team composition request detected, returning default result for now");
        return new AllStatsDTO(null, null);
    }

    public AllStatsDTO handleNothing(Integer trophies) {
        logger.info("handleNothing called");

        List<DataEntity> battles = dataRepository.findAll(trophies);
        logger.info("Found {} battles", battles.size());

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

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();

        AllStatsDTO result = new AllStatsDTO(brawlerList, null);
        return result;
    }

    public AllStatsDTO handleMapOnly(String map) {
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

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();

        AllStatsDTO result = new AllStatsDTO(brawlerList, null);
        return result;
    }

    public AllStatsDTO handle1Red(String map, String brawler1, Integer trophies) {
        logger.info("handle1Red called for map: {} and brawler: {}", map, brawler1);
        List<DataEntity> battles;
        if (map == null || map.isEmpty()) {
            logger.info("Finding battles by 1Red");
            battles = dataRepository.findBy1Red(brawler1, trophies);
        } else {
            battles = dataRepository.findBy1RedAndMap(map, brawler1, trophies);
        }
        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            if (!brawler1.equals(battle.getBlueBrawler1())) {
                processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler2())) {
                processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler3())) {
                processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
            }

            if (!brawler1.equals(battle.getRedBrawler1())) {
                processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler2())) {
                processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler3())) {
                processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
            }
        }

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();

        AllStatsDTO result = new AllStatsDTO(brawlerList, null);
        return result;
    }

    public AllStatsDTO handle1Red1Blue(String map, String brawler1, String brawler2, Integer trophies,
            boolean bluesIncluded) {
        logger.info("handle1Red1Blue called for map: {} and brawlers: {} and {}", map, brawler1, brawler2);
        List<DataEntity> battles;
        logger.info("Blues included: {}", bluesIncluded);
        if (!bluesIncluded) {
            return handle1Red(map, brawler1, trophies);
        } else {
            if (map == null || map.isEmpty()) {
                battles = dataRepository.findBy1Red1Blue(brawler1, brawler2, trophies);
            } else {
                battles = dataRepository.findBy1Red1BlueAndMap(map, brawler1, brawler2, trophies);
            }
        }
        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();
        Map<String, int[]> teamStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            boolean isRedRed = (brawler1.equals(battle.getRedBrawler1()) || brawler1.equals(battle.getRedBrawler2())
                    || brawler1.equals(battle.getRedBrawler3()));
            if (isRedRed) {
                if (!brawler1.equals(battle.getBlueBrawler1()) && !brawler2.equals(battle.getBlueBrawler1())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getBlueBrawler2()) && !brawler2.equals(battle.getBlueBrawler2())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getBlueBrawler3()) && !brawler2.equals(battle.getBlueBrawler3())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
                }
            }

            if (!isRedRed) {
                if (!brawler1.equals(battle.getRedBrawler1()) && !brawler2.equals(battle.getRedBrawler1())) {
                    processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getRedBrawler2()) && !brawler2.equals(battle.getRedBrawler2())) {
                    processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getRedBrawler3()) && !brawler2.equals(battle.getRedBrawler3())) {
                    processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
                }
            }
        }

        List<DataEntity> newBattles;
        if (map == null || map.isEmpty()) {
            newBattles = dataRepository.findBy1Red1Blue(brawler1, brawler2, trophies);
        } else {
            newBattles = dataRepository.findBy1Red1BlueAndMap(map, brawler1, brawler2, trophies);
        }
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
                processTeam(teamStats, team, redAndBlueHasBrawlers);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(teamStats, team, false);
            }
        }

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();
        List<StatsDTO> teamList = teamStats.entrySet().stream()
                .map(entry -> {
                    String team = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Team: {}, Wins: {}, Total: {}, WinRate: {}",
                            team, wins, total, winRate);

                    return new StatsDTO(team, winRate, total);
                }).toList();

        AllStatsDTO result = new AllStatsDTO(brawlerList, teamList);
        return result;
    }

    public AllStatsDTO handle2Red1Blue(String map, String brawler1, String brawler2, String brawler3,
            Integer trophies, boolean bluesIncluded) {
        logger.info("handle2Red1Blue called for map: {} and brawlers: {} and {}", map, brawler1, brawler2);
        List<DataEntity> battles;
        if (!bluesIncluded) {
            return handle2Red(map, brawler1, brawler2, trophies);
        } else {
            if (map == null || map.isEmpty()) {
                battles = dataRepository.findBy2Red1Blue(brawler1, brawler2, brawler3, trophies);
            } else {
                battles = dataRepository.findBy2Red1BlueAndMap(map, brawler1, brawler2, brawler3, trophies);
            }
        }
        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();
        Map<String, int[]> teamStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            boolean isRedRed = (brawler1.equals(battle.getRedBrawler1()) || brawler1.equals(battle.getRedBrawler2())
                    || brawler1.equals(battle.getRedBrawler3()))
                    && (brawler2.equals(battle.getRedBrawler1()) || brawler2.equals(battle.getRedBrawler2())
                            || brawler2.equals(battle.getRedBrawler3()));
            if (isRedRed) {
                if (!brawler1.equals(battle.getBlueBrawler1()) && !brawler2.equals(battle.getBlueBrawler1())
                        && !brawler3.equals(battle.getBlueBrawler1())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getBlueBrawler2()) && !brawler2.equals(battle.getBlueBrawler2())
                        && !brawler3.equals(battle.getBlueBrawler2())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getBlueBrawler3()) && !brawler2.equals(battle.getBlueBrawler3())
                        && !brawler3.equals(battle.getBlueBrawler3())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
                }
            }
            if (!isRedRed) {
                if (!brawler1.equals(battle.getRedBrawler1()) && !brawler2.equals(battle.getRedBrawler1())
                        && !brawler3.equals(battle.getRedBrawler1())) {
                    processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getRedBrawler2()) && !brawler2.equals(battle.getRedBrawler2())
                        && !brawler3.equals(battle.getRedBrawler2())) {
                    processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getRedBrawler3()) && !brawler2.equals(battle.getRedBrawler3())
                        && !brawler3.equals(battle.getRedBrawler3())) {
                    processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
                }

            }
        }

        List<DataEntity> newBattles;
        if (map == null || map.isEmpty()) {
            newBattles = dataRepository.findBy2Red1Blue(brawler1, brawler2, brawler3, trophies);
        } else {
            newBattles = dataRepository.findBy2Red1BlueAndMap(map, brawler1, brawler2, brawler3, trophies);
        }
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
                processTeam(teamStats, team, true);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(teamStats, team, false);
            }
        }

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();
        List<StatsDTO> teamList = teamStats.entrySet().stream()
                .map(entry -> {
                    String team = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Team: {}, Wins: {}, Total: {}, WinRate: {}",
                            team, wins, total, winRate);

                    return new StatsDTO(team, winRate, total);
                }).toList();
        AllStatsDTO result = new AllStatsDTO(brawlerList, teamList);
        return result;
    }

    public AllStatsDTO handle2Red2Blue(String map, String brawler1, String brawler2, String brawler3,
            String brawler4, Integer trophies, boolean bluesIncluded) {
        logger.info("handle2Red2Blue called for map: {} and brawlers: {} and {}", map, brawler1, brawler2);
        List<DataEntity> battles;

        if (!bluesIncluded) {
            return handle2Red(map, brawler1, brawler2, trophies);
        } else {
            if (map == null || map.isEmpty()) {
                battles = dataRepository.findBy2Red2Blue(brawler1, brawler2, brawler3, brawler4, trophies);
            } else {
                battles = dataRepository.findBy2Red2BlueAndMap(map, brawler1, brawler2, brawler3, brawler4, trophies);
            }
        }

        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();
        Map<String, int[]> teamStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            boolean isRedRed = (brawler1.equals(battle.getRedBrawler1()) || brawler1.equals(battle.getRedBrawler2())
                    || brawler1.equals(battle.getRedBrawler3()))
                    && (brawler2.equals(battle.getRedBrawler1()) || brawler2.equals(battle.getRedBrawler2())
                            || brawler2.equals(battle.getRedBrawler3()));
            if (isRedRed) {
                if (!brawler1.equals(battle.getBlueBrawler1()) && !brawler2.equals(battle.getBlueBrawler1())
                        && !brawler3.equals(battle.getBlueBrawler1()) && !brawler4.equals(battle.getBlueBrawler1())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getBlueBrawler2()) && !brawler2.equals(battle.getBlueBrawler2())
                        && !brawler3.equals(battle.getBlueBrawler2()) && !brawler4.equals(battle.getBlueBrawler2())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getBlueBrawler3()) && !brawler2.equals(battle.getBlueBrawler3())
                        && !brawler3.equals(battle.getBlueBrawler3()) && !brawler4.equals(battle.getBlueBrawler3())) {
                    processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
                }
            }

            if (!isRedRed) {
                if (!brawler1.equals(battle.getRedBrawler1()) && !brawler2.equals(battle.getRedBrawler1())
                        && !brawler3.equals(battle.getRedBrawler1()) && !brawler4.equals(battle.getRedBrawler1())) {
                    processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getRedBrawler2()) && !brawler2.equals(battle.getRedBrawler2())
                        && !brawler3.equals(battle.getRedBrawler2()) && !brawler4.equals(battle.getRedBrawler2())) {
                    processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
                }
                if (!brawler1.equals(battle.getRedBrawler3()) && !brawler2.equals(battle.getRedBrawler3())
                        && !brawler3.equals(battle.getRedBrawler3()) && !brawler4.equals(battle.getRedBrawler3())) {
                    processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
                }
            }
        }

        List<DataEntity> newBattles;

        if (map == null || map.isEmpty()) {
            newBattles = dataRepository.findBy2Red2Blue(brawler1, brawler2, brawler3, brawler4, trophies);
        } else {
            newBattles = dataRepository.findBy2Red2BlueAndMap(map, brawler1, brawler2, brawler3, brawler4, trophies);
        }

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
                processTeam(teamStats, team, true);
            } else {
                String team = battle.getRedBrawler1() + " " + battle.getRedBrawler2() + " " + battle.getRedBrawler3()
                        + " VS "
                        + battle.getBlueBrawler1() + " " + battle.getBlueBrawler2() + " " + battle.getBlueBrawler3();
                processTeam(teamStats, team, false);
            }
        }

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();
        List<StatsDTO> teamList = teamStats.entrySet().stream()
                .map(entry -> {
                    String team = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Team: {}, Wins: {}, Total: {}, WinRate: {}",
                            team, wins, total, winRate);

                    return new StatsDTO(team, winRate, total);
                }).toList();
        AllStatsDTO result = new AllStatsDTO(brawlerList, teamList);
        return result;
    }

    public AllStatsDTO handle3Red2Blue(String map, String brawler1, String brawler2, String brawler3,
            String brawler4, String brawler5, Integer trophies, boolean bluesIncluded) {
        logger.info("handle3Red2Blue called for map: {} and brawlers: {} and {}", map, brawler1, brawler2);
        List<DataEntity> battles;

        if (!bluesIncluded) {
            return handle3Red(map, brawler1, brawler2, brawler3, trophies);
        } else {
            if (map == null || map.isEmpty()) {
                battles = dataRepository.findBy3Red2Blue(brawler1, brawler2, brawler3, brawler4, brawler5, trophies);
            } else {
                battles = dataRepository.findBy3Red2BlueAndMap(map, brawler1, brawler2, brawler3, brawler4, brawler5,
                        trophies);
            }
        }

        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();
        Map<String, int[]> teamStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            if (!brawler1.equals(battle.getBlueBrawler1()) && !brawler2.equals(battle.getBlueBrawler1())
                    && !brawler3.equals(battle.getBlueBrawler1()) && !brawler4.equals(battle.getBlueBrawler1())
                    && !brawler5.equals(battle.getBlueBrawler1())) {
                processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler2()) && !brawler2.equals(battle.getBlueBrawler2())
                    && !brawler3.equals(battle.getBlueBrawler2()) && !brawler4.equals(battle.getBlueBrawler2())
                    && !brawler5.equals(battle.getBlueBrawler2())) {
                processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler3()) && !brawler2.equals(battle.getBlueBrawler3())
                    && !brawler3.equals(battle.getBlueBrawler3()) && !brawler4.equals(battle.getBlueBrawler3())
                    && !brawler5.equals(battle.getBlueBrawler3())) {
                processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
            }

            if (!brawler1.equals(battle.getRedBrawler1()) && !brawler2.equals(battle.getRedBrawler1())
                    && !brawler3.equals(battle.getRedBrawler1()) && !brawler4.equals(battle.getRedBrawler1())
                    && !brawler5.equals(battle.getRedBrawler1())) {
                processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler2()) && !brawler2.equals(battle.getRedBrawler2())
                    && !brawler3.equals(battle.getRedBrawler2()) && !brawler4.equals(battle.getRedBrawler2())
                    && !brawler5.equals(battle.getRedBrawler2())) {
                processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler3()) && !brawler2.equals(battle.getRedBrawler3())
                    && !brawler3.equals(battle.getRedBrawler3()) && !brawler4.equals(battle.getRedBrawler3())
                    && !brawler5.equals(battle.getRedBrawler3())) {
                processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
            }
        }

        List<DataEntity> newBattles;

        if (map == null || map.isEmpty()) {
            newBattles = dataRepository.findBy3Red2Blue(brawler1, brawler2, brawler3, brawler4, brawler5, trophies);
        } else {
            newBattles = dataRepository.findBy3Red2BlueAndMap(map, brawler1, brawler2, brawler3, brawler4, brawler5,
                    trophies);
        }

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

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();
        List<StatsDTO> teamList = teamStats.entrySet().stream()
                .map(entry -> {
                    String team = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Team: {}, Wins: {}, Total: {}, WinRate: {}",
                            team, wins, total, winRate);

                    return new StatsDTO(team, winRate, total);
                }).toList();
        AllStatsDTO result = new AllStatsDTO(brawlerList, teamList);
        return result;
    }

    public AllStatsDTO handle2Red(String map, String brawler1, String brawler2, Integer trophies) {
        logger.info("handle2Red called for map: {} and brawlers: {} and {}", map, brawler1, brawler2);
        List<DataEntity> battles;
        if (map == null || map.isEmpty()) {
            battles = dataRepository.findBy2Red(brawler1, brawler2, trophies);
        } else {
            battles = dataRepository.findBy2RedAndMap(map, brawler1, brawler2, trophies);
        }
        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            if (!brawler1.equals(battle.getBlueBrawler1()) && !brawler2.equals(battle.getBlueBrawler1())) {
                processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler2()) && !brawler2.equals(battle.getBlueBrawler2())) {
                processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler3()) && !brawler2.equals(battle.getBlueBrawler3())) {
                processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
            }

            if (!brawler1.equals(battle.getRedBrawler1()) && !brawler2.equals(battle.getRedBrawler1())) {
                processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler2()) && !brawler2.equals(battle.getRedBrawler2())) {
                processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler3()) && !brawler2.equals(battle.getRedBrawler3())) {
                processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
            }
        }

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();
        AllStatsDTO result = new AllStatsDTO(brawlerList, null);
        return result;
    }

    public AllStatsDTO handle3Red(String map, String brawler1, String brawler2, String brawler3,
            Integer trophies) {
        logger.info("handle3Red called for map: {} and brawlers: {} {} and {}", map, brawler1, brawler2, brawler3);
        List<DataEntity> battles;
        if (map == null || map.isEmpty()) {
            battles = dataRepository.findBy3Red(brawler1, brawler2, brawler3, trophies);
        } else {
            battles = dataRepository.findBy3RedAndMap(map, brawler1, brawler2, brawler3, trophies);
        }
        logger.info("Found {} battles for map: {}", battles.size(), map);

        Map<String, int[]> brawlerStats = new HashMap<>();

        logger.debug("Processing {} battles", battles.size());
        for (DataEntity battle : battles) {
            logger.trace("Processing battle with ID: {}", battle.getId());
            if (!brawler1.equals(battle.getBlueBrawler1()) && !brawler2.equals(battle.getBlueBrawler1())
                    && !brawler3.equals(battle.getBlueBrawler1())) {
                processBrawler(brawlerStats, battle.getBlueBrawler1(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler2()) && !brawler2.equals(battle.getBlueBrawler2())
                    && !brawler3.equals(battle.getBlueBrawler2())) {
                processBrawler(brawlerStats, battle.getBlueBrawler2(), true, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getBlueBrawler3()) && !brawler2.equals(battle.getBlueBrawler3())
                    && !brawler3.equals(battle.getBlueBrawler3())) {
                processBrawler(brawlerStats, battle.getBlueBrawler3(), true, battle.getIsTwoOh());
            }

            if (!brawler1.equals(battle.getRedBrawler1()) && !brawler2.equals(battle.getRedBrawler1())
                    && !brawler3.equals(battle.getRedBrawler1())) {
                processBrawler(brawlerStats, battle.getRedBrawler1(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler2()) && !brawler2.equals(battle.getRedBrawler2())
                    && !brawler3.equals(battle.getRedBrawler2())) {
                processBrawler(brawlerStats, battle.getRedBrawler2(), false, battle.getIsTwoOh());
            }
            if (!brawler1.equals(battle.getRedBrawler3()) && !brawler2.equals(battle.getRedBrawler3())
                    && !brawler3.equals(battle.getRedBrawler3())) {
                processBrawler(brawlerStats, battle.getRedBrawler3(), false, battle.getIsTwoOh());
            }
        }

        logger.debug("Found stats for {} unique brawlers before filtering", brawlerStats.size());

        List<StatsDTO> brawlerList = brawlerStats.entrySet().stream()
                .map(entry -> {
                    String brawler = entry.getKey();
                    int[] stats = entry.getValue();
                    int wins = stats[0];
                    int total = stats[1];
                    double winRate = total > 0 ? (double) wins / total : 0.0;

                    logger.trace("Brawler: {}, Wins: {}, Total: {}, WinRate: {}",
                            brawler, wins, total, winRate);

                    return new StatsDTO(brawler, winRate, total);
                }).toList();
        AllStatsDTO result = new AllStatsDTO(brawlerList, null);
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
            if (!isTwoOh) {
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
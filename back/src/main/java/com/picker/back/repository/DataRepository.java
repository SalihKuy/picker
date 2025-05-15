package com.picker.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.picker.back.model.entity.DataEntity;
import com.picker.back.model.dto.PlayerDTO;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface DataRepository extends JpaRepository<DataEntity, Long> {
        String TAG_MATCH_CLAUSE = " (d.tag1 = :playerTag OR d.tag2 = :playerTag OR d.tag3 = :playerTag " +
                        "OR d.tag4 = :playerTag OR d.tag5 = :playerTag OR d.tag6 = :playerTag) ";

        Optional<DataEntity> findByBattleTime(OffsetDateTime battleTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findAll(
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findByMap(
                        @Param("map") String map,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND (" +
                        "  (d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1)" +
                        "  OR " +
                        "  (d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1)" +
                        ") " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy1RedAndMap(
                        @Param("map") String map,
                        @Param("brawler1") String brawler1,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE (" +
                        "  (d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1)" +
                        "  OR " +
                        "  (d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1)" +
                        ") " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy1Red(
                        @Param("brawler1") String brawler1,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND ((" +
                        "  (d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1) AND " +
                        "  (d.redBrawler1 = :brawler2 OR d.redBrawler2 = :brawler2 OR d.redBrawler3 = :brawler2)" +
                        ") OR (" +
                        "  (d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1) AND "
                        +
                        "  (d.blueBrawler1 = :brawler2 OR d.blueBrawler2 = :brawler2 OR d.blueBrawler3 = :brawler2)" +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy2RedAndMap(
                        @Param("map") String map,
                        @Param("brawler1") String brawler1,
                        @Param("brawler2") String brawler2,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE ((" +
                        "  (d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1) AND " +
                        "  (d.redBrawler1 = :brawler2 OR d.redBrawler2 = :brawler2 OR d.redBrawler3 = :brawler2)" +
                        ") OR (" +
                        "  (d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1) AND "
                        +
                        "  (d.blueBrawler1 = :brawler2 OR d.blueBrawler2 = :brawler2 OR d.blueBrawler3 = :brawler2)" +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy2Red(
                        @Param("brawler1") String brawler1,
                        @Param("brawler2") String brawler2,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND ((" +
                        "  (d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1) AND " +
                        "  (d.redBrawler1 = :brawler2 OR d.redBrawler2 = :brawler2 OR d.redBrawler3 = :brawler2) AND " +
                        "  (d.redBrawler1 = :brawler3 OR d.redBrawler2 = :brawler3 OR d.redBrawler3 = :brawler3)" +
                        ") OR (" +
                        "  (d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1) AND "
                        +
                        "  (d.blueBrawler1 = :brawler2 OR d.blueBrawler2 = :brawler2 OR d.blueBrawler3 = :brawler2) AND "
                        +
                        "  (d.blueBrawler1 = :brawler3 OR d.blueBrawler2 = :brawler3 OR d.blueBrawler3 = :brawler3)" +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy3RedAndMap(
                        @Param("map") String map,
                        @Param("brawler1") String brawler1,
                        @Param("brawler2") String brawler2,
                        @Param("brawler3") String brawler3,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE ((" +
                        "  (d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1) AND " +
                        "  (d.redBrawler1 = :brawler2 OR d.redBrawler2 = :brawler2 OR d.redBrawler3 = :brawler2) AND " +
                        "  (d.redBrawler1 = :brawler3 OR d.redBrawler2 = :brawler3 OR d.redBrawler3 = :brawler3)" +
                        ") OR (" +
                        "  (d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1) AND "
                        +
                        "  (d.blueBrawler1 = :brawler2 OR d.blueBrawler2 = :brawler2 OR d.blueBrawler3 = :brawler2) AND "
                        +
                        "  (d.blueBrawler1 = :brawler3 OR d.blueBrawler2 = :brawler3 OR d.blueBrawler3 = :brawler3)" +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy3Red(
                        @Param("brawler1") String brawler1,
                        @Param("brawler2") String brawler2,
                        @Param("brawler3") String brawler3,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND ((" +
                        "  (d.redBrawler1 = :redBrawler OR d.redBrawler2 = :redBrawler OR d.redBrawler3 = :redBrawler) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler OR d.blueBrawler2 = :blueBrawler OR d.blueBrawler3 = :blueBrawler)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler OR d.blueBrawler2 = :redBrawler OR d.blueBrawler3 = :redBrawler) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler OR d.redBrawler2 = :blueBrawler OR d.redBrawler3 = :blueBrawler)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy1Red1BlueAndMap(
                        @Param("map") String map,
                        @Param("redBrawler") String redBrawler,
                        @Param("blueBrawler") String blueBrawler,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE ((" +
                        "  (d.redBrawler1 = :redBrawler OR d.redBrawler2 = :redBrawler OR d.redBrawler3 = :redBrawler) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler OR d.blueBrawler2 = :blueBrawler OR d.blueBrawler3 = :blueBrawler)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler OR d.blueBrawler2 = :redBrawler OR d.blueBrawler3 = :redBrawler) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler OR d.redBrawler2 = :blueBrawler OR d.redBrawler3 = :blueBrawler)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy1Red1Blue(
                        @Param("redBrawler") String redBrawler,
                        @Param("blueBrawler") String blueBrawler,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND ((" +
                        "  (d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler OR d.blueBrawler2 = :blueBrawler OR d.blueBrawler3 = :blueBrawler)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler OR d.redBrawler2 = :blueBrawler OR d.redBrawler3 = :blueBrawler)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy2Red1BlueAndMap(
                        @Param("map") String map,
                        @Param("redBrawler1") String redBrawler1,
                        @Param("redBrawler2") String redBrawler2,
                        @Param("blueBrawler") String blueBrawler,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE ((" +
                        "  (d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler OR d.blueBrawler2 = :blueBrawler OR d.blueBrawler3 = :blueBrawler)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler OR d.redBrawler2 = :blueBrawler OR d.redBrawler3 = :blueBrawler)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy2Red1Blue(
                        @Param("redBrawler1") String redBrawler1,
                        @Param("redBrawler2") String redBrawler2,
                        @Param("blueBrawler") String blueBrawler,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND ((" +
                        "  (d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler1 OR d.blueBrawler2 = :blueBrawler1 OR d.blueBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler2 OR d.blueBrawler2 = :blueBrawler2 OR d.blueBrawler3 = :blueBrawler2)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler1 OR d.redBrawler2 = :blueBrawler1 OR d.redBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler2 OR d.redBrawler2 = :blueBrawler2 OR d.redBrawler3 = :blueBrawler2)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy2Red2BlueAndMap(
                        @Param("map") String map,
                        @Param("redBrawler1") String redBrawler1,
                        @Param("redBrawler2") String redBrawler2,
                        @Param("blueBrawler1") String blueBrawler1,
                        @Param("blueBrawler2") String blueBrawler2,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE ((" +
                        "  (d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler1 OR d.blueBrawler2 = :blueBrawler1 OR d.blueBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler2 OR d.blueBrawler2 = :blueBrawler2 OR d.blueBrawler3 = :blueBrawler2)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler1 OR d.redBrawler2 = :blueBrawler1 OR d.redBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler2 OR d.redBrawler2 = :blueBrawler2 OR d.redBrawler3 = :blueBrawler2)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy2Red2Blue(
                        @Param("redBrawler1") String redBrawler1,
                        @Param("redBrawler2") String redBrawler2,
                        @Param("blueBrawler1") String blueBrawler1,
                        @Param("blueBrawler2") String blueBrawler2,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND ((" +
                        "  (d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler3 OR d.redBrawler2 = :redBrawler3 OR d.redBrawler3 = :redBrawler3) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler1 OR d.blueBrawler2 = :blueBrawler1 OR d.blueBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler2 OR d.blueBrawler2 = :blueBrawler2 OR d.blueBrawler3 = :blueBrawler2)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler3 OR d.blueBrawler2 = :redBrawler3 OR d.blueBrawler3 = :redBrawler3) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler1 OR d.redBrawler2 = :blueBrawler1 OR d.redBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler2 OR d.redBrawler2 = :blueBrawler2 OR d.redBrawler3 = :blueBrawler2)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy3Red2BlueAndMap(
                        @Param("map") String map,
                        @Param("redBrawler1") String redBrawler1,
                        @Param("redBrawler2") String redBrawler2,
                        @Param("redBrawler3") String redBrawler3,
                        @Param("blueBrawler1") String blueBrawler1,
                        @Param("blueBrawler2") String blueBrawler2,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE ((" +
                        "  (d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.redBrawler1 = :redBrawler3 OR d.redBrawler2 = :redBrawler3 OR d.redBrawler3 = :redBrawler3) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler1 OR d.blueBrawler2 = :blueBrawler1 OR d.blueBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :blueBrawler2 OR d.blueBrawler2 = :blueBrawler2 OR d.blueBrawler3 = :blueBrawler2)"
                        +
                        ") OR (" +
                        "  (d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND "
                        +
                        "  (d.blueBrawler1 = :redBrawler3 OR d.blueBrawler2 = :redBrawler3 OR d.blueBrawler3 = :redBrawler3) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler1 OR d.redBrawler2 = :blueBrawler1 OR d.redBrawler3 = :blueBrawler1) AND "
                        +
                        "  (d.redBrawler1 = :blueBrawler2 OR d.redBrawler2 = :blueBrawler2 OR d.redBrawler3 = :blueBrawler2)"
                        +
                        ")) " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime")
        List<DataEntity> findBy3Red2Blue(
                        @Param("redBrawler1") String redBrawler1,
                        @Param("redBrawler2") String redBrawler2,
                        @Param("redBrawler3") String redBrawler3,
                        @Param("blueBrawler1") String blueBrawler1,
                        @Param("blueBrawler2") String blueBrawler2,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime);

        @Query("SELECT d FROM DataEntity d WHERE d.battleTime = :battleTime AND" + TAG_MATCH_CLAUSE)
        Optional<DataEntity> findByBattleTimeAndPlayerTag(
                        @Param("battleTime") OffsetDateTime battleTime,
                        @Param("playerTag") String playerTag);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime " +
                        "AND" + TAG_MATCH_CLAUSE)
        List<DataEntity> findAllByPlayerTag(
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime,
                        @Param("playerTag") String playerTag);

        @Query("SELECT d FROM DataEntity d " +
                        "WHERE d.map = :map " +
                        "AND d.trophies > :trophies " +
                        "AND d.battleTime > :afterDateTime " +
                        "AND" + TAG_MATCH_CLAUSE)
        List<DataEntity> findByMapAndPlayerTag(
                        @Param("map") String map,
                        @Param("trophies") Integer trophies,
                        @Param("afterDateTime") OffsetDateTime afterDateTime,
                        @Param("playerTag") String playerTag);

        @Query(value = "SELECT tag AS playerTag, COUNT(*) AS wins " +
                        "FROM (" +
                        "    SELECT tag1 AS tag FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies "
                        +
                        "    UNION ALL " +
                        "    SELECT tag2 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies " +
                        "    UNION ALL " +
                        "    SELECT tag3 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies " +
                        "    UNION ALL " +
                        "    SELECT tag4 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies " +
                        "    UNION ALL " +
                        "    SELECT tag5 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies " +
                        "    UNION ALL " +
                        "    SELECT tag6 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies " +
                        ") AS all_tags " +
                        "WHERE tag IS NOT NULL " +
                        "GROUP BY tag " +
                        "ORDER BY wins DESC", nativeQuery = true)
        List<PlayerDTO> findMostBattlers(
                        @Param("battleTime") OffsetDateTime battleTime,
                        @Param("trophies") Integer trophies);

        @Query(value = "WITH winners AS (" +
                        "    SELECT tag1 AS tag FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies AND tag1 IS NOT NULL "
                        +
                        "    UNION ALL " +
                        "    SELECT tag2 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies AND tag2 IS NOT NULL "
                        +
                        "    UNION ALL " +
                        "    SELECT tag3 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies AND tag3 IS NOT NULL "
                        +
                        "), " +
                        "losers AS ( " +
                        "    SELECT tag4 AS tag FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies AND tag4 IS NOT NULL "
                        +
                        "    UNION ALL " +
                        "    SELECT tag5 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies AND tag5 IS NOT NULL "
                        +
                        "    UNION ALL " +
                        "    SELECT tag6 FROM data_entity3 WHERE battle_time > :battleTime AND trophies > :trophies AND tag6 IS NOT NULL "
                        +
                        "), " +
                        "all_tags AS ( " +
                        "    SELECT tag, COUNT(*) AS wins FROM winners GROUP BY tag " +
                        "), " +
                        "all_losses AS ( " +
                        "    SELECT tag, COUNT(*) AS losses FROM losers GROUP BY tag " +
                        "), " +
                        "winrates AS ( " +
                        "    SELECT " +
                        "        COALESCE(w.tag, l.tag) AS playerTag, " +
                        "        COALESCE(w.wins, 0) AS wins, " +
                        "        COALESCE(l.losses, 0) AS losses, " +
                        "        ROUND(COALESCE(w.wins::decimal, 0) / NULLIF(COALESCE(w.wins, 0) + COALESCE(l.losses, 0), 0), 4) AS winrate "
                        +
                        "    FROM all_tags w " +
                        "    FULL OUTER JOIN all_losses l ON w.tag = l.tag " +
                        ") " +
                        "SELECT * FROM winrates " +
                        "ORDER BY winrate DESC ", nativeQuery = true)
        List<PlayerDTO> findPlayerWinRates(
                        @Param("battleTime") OffsetDateTime battleTime,
                        @Param("trophies") Integer trophies);
}
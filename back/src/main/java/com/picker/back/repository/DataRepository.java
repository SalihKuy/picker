package com.picker.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.picker.back.model.entity.DataEntity;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface DataRepository extends JpaRepository<DataEntity, Long> {
    Optional<DataEntity> findByBattleTime(OffsetDateTime battleTime);

    List<DataEntity> findByMap(String map);

    @Query("SELECT d FROM DataEntity d " +
            "WHERE d.map = :map " +
            "AND ((" +
            "(d.redBrawler1 = :brawler1 OR d.redBrawler2 = :brawler1 OR d.redBrawler3 = :brawler1) AND " +
            "(d.redBrawler1 = :brawler2 OR d.redBrawler2 = :brawler2 OR d.redBrawler3 = :brawler2)" +
            ") OR (" +
            "(d.blueBrawler1 = :brawler1 OR d.blueBrawler2 = :brawler1 OR d.blueBrawler3 = :brawler1) AND " +
            "(d.blueBrawler1 = :brawler2 OR d.blueBrawler2 = :brawler2 OR d.blueBrawler3 = :brawler2)" +
            "))")
    List<DataEntity> findByTwoRedAndMap(
            @Param("map") String map,
            @Param("brawler1") String brawler1,
            @Param("brawler2") String brawler2);

    @Query("SELECT d FROM DataEntity d " +
            "WHERE d.map = :map " +
            "AND ((" +
            "(d.redBrawler1 = :redBrawler1 OR d.redBrawler2 = :redBrawler1 OR d.redBrawler3 = :redBrawler1) AND " +
            "(d.redBrawler1 = :redBrawler2 OR d.redBrawler2 = :redBrawler2 OR d.redBrawler3 = :redBrawler2) AND " +
            "(d.blueBrawler1 = :blueBrawler OR d.blueBrawler2 = :blueBrawler OR d.blueBrawler3 = :blueBrawler)" +
            ") OR (" +
            "(d.blueBrawler1 = :redBrawler1 OR d.blueBrawler2 = :redBrawler1 OR d.blueBrawler3 = :redBrawler1) AND " +
            "(d.blueBrawler1 = :redBrawler2 OR d.blueBrawler2 = :redBrawler2 OR d.blueBrawler3 = :redBrawler2) AND " +
            "(d.redBrawler1 = :blueBrawler OR d.redBrawler2 = :blueBrawler OR d.redBrawler3 = :blueBrawler)" +
            "))")
    List<DataEntity> findBy2Red1BlueAndMap(
            @Param("map") String map,
            @Param("redBrawler1") String redBrawler1,
            @Param("redBrawler2") String redBrawler2,
            @Param("blueBrawler") String blueBrawler);

}
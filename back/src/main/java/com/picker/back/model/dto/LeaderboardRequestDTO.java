package com.picker.back.model.dto;
import java.time.LocalDate;

public class LeaderboardRequestDTO {
    private String rank;
    private LocalDate dateFilter;
    private Integer minBattles;

    public LeaderboardRequestDTO(String rank, LocalDate dateFilter, Integer minBattles) {
        this.rank = rank;
        this.dateFilter = dateFilter;
        this.minBattles = minBattles;
    }
    public String getRank() {
        return rank;
    }
    public void setRank(String rank) {
        this.rank = rank;
    }
    public LocalDate getDateFilter() {
        return dateFilter;
    }
    public void setDateFilter(LocalDate dateFilter) {
        this.dateFilter = dateFilter;
    }
    public Integer getMinBattles() {
        return minBattles;
    }
    public void setMinBattles(Integer minBattles) {
        this.minBattles = minBattles;
    }
}

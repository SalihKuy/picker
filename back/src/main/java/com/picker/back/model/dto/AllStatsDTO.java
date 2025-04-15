package com.picker.back.model.dto;
import java.util.List;

public class AllStatsDTO {
    private List<StatsDTO> brawlerStats;
    private List<StatsDTO> teamStats;

    public AllStatsDTO(List<StatsDTO> brawlerStats, List<StatsDTO> teamStats) {
        this.brawlerStats = brawlerStats;
        this.teamStats = teamStats;
    }
    public List<StatsDTO> getBrawlerStats() {
        return brawlerStats;
    }
    public void setBrawlerStats(List<StatsDTO> brawlerStats) {
        this.brawlerStats = brawlerStats;
    }
    public List<StatsDTO> getTeamStats() {
        return teamStats;
    }
    public void setTeamStats(List<StatsDTO> teamStats) {
        this.teamStats = teamStats;
    }
}

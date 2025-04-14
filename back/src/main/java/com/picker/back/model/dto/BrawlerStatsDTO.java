package com.picker.back.model.dto;

public class BrawlerStatsDTO {
    private String brawlerName;
    private double winRate;
    private int matchCount;
    private int trophies;
    
    public BrawlerStatsDTO(String brawlerName, double winRate, int matchCount) {
        this.brawlerName = brawlerName;
        this.winRate = winRate;
        this.matchCount = matchCount;
    }
    
    public String getBrawlerName() {
        return brawlerName;
    }
    
    public void setBrawlerName(String brawlerName) {
        this.brawlerName = brawlerName;
    }
    
    public double getWinRate() {
        return winRate;
    }
    
    public void setWinRate(double winRate) {
        this.winRate = winRate;
    }
    
    public int getMatchCount() {
        return matchCount;
    }
    
    public void setMatchCount(int matchCount) {
        this.matchCount = matchCount;
    }
    public int getTrophies() {
        return trophies;
    }
    public void setTrophies(int trophies) {
        this.trophies = trophies;
    }
}
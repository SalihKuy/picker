package com.picker.back.model.dto;

import java.util.List;

public class BrawlerRequestDTO {
    private String map;
    private List<String> blueBrawlers;
    private List<String> redBrawlers;
    private Integer trophies;
    private boolean bluesIncluded;

    public BrawlerRequestDTO(String map, List<String> blueBrawlers, List<String> redBrawlers, int trophies, boolean bluesIncluded) {
        this.map = map;
        this.blueBrawlers = blueBrawlers;
        this.redBrawlers = redBrawlers;
        this.trophies = trophies;
        this.bluesIncluded = bluesIncluded;
    }

    public String getMap() {
        return map;
    }
    
    public void setMap(String map) {
        this.map = map;
    }
    
    public List<String> getBlueBrawlers() {
        return blueBrawlers;
    }
    
    public void setBlueBrawlers(List<String> blueBrawlers) {
        this.blueBrawlers = blueBrawlers;
    }
    
    public List<String> getRedBrawlers() {
        return redBrawlers;
    }
    
    public void setRedBrawlers(List<String> redBrawlers) {
        this.redBrawlers = redBrawlers;
    }

    public Integer getTrophies() {
        return trophies;
    }

    public void setTrophies(Integer trophies) {
        this.trophies = trophies;
    }

    public boolean isBluesIncluded() {
        return bluesIncluded;
    }

    public void setBluesIncluded(boolean bluesIncluded) {
        this.bluesIncluded = bluesIncluded;
    }

    @Override
    public String toString() {
        return "BrawlerRequestDTO{" +
               "map='" + map + '\'' +
               ", blueBrawlers=" + blueBrawlers +
               ", redBrawlers=" + redBrawlers +
               ", trophies=" + trophies +
               '}';
    }
}
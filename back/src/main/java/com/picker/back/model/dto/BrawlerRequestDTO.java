package com.picker.back.model.dto;

import java.util.List;

public class BrawlerRequestDTO {
    private String map;
    private List<String> blueBrawlers;
    private List<String> redBrawlers;

    public BrawlerRequestDTO(String map, List<String> blueBrawlers, List<String> redBrawlers) {
        this.map = map;
        this.blueBrawlers = blueBrawlers;
        this.redBrawlers = redBrawlers;
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
    
    @Override
    public String toString() {
        return "BrawlerRequestDTO{" +
                "map='" + map + '\'' +
                ", blueBrawlers=" + blueBrawlers +
                ", redBrawlers=" + redBrawlers +
                '}';
    }
}
package com.picker.back.model.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ApiResponseDTO {
    private List<Item> items;

    public List<Item> getItems() {
        return items;
    }

    public void setItems(List<Item> items) {
        this.items = items;
    }

    public static class Item {
        private String battleTime;
        private Event event;
        private Battle battle;

        @JsonFormat(pattern = "yyyyMMdd'T'HHmmss.SSSX")
        public String getBattleTime() {
            return battleTime;
        }

        public void setBattleTime(String battleTime) {
            this.battleTime = battleTime;
        }

        public Event getEvent() {
            return event;
        }

        public void setEvent(Event event) {
            this.event = event;
        }

        public Battle getBattle() {
            return battle;
        }

        public void setBattle(Battle battle) {
            this.battle = battle;
        }
    }

    public static class Event {
        private int id;
        private String mode;
        private String map;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public String getMap() {
            return map;
        }

        public void setMap(String map) {
            this.map = map;
        }
    }

    public static class Battle {
        private String mode;
        private String type;
        private String result;
        private int duration;
        private Player starPlayer;
        private List<List<Player>> teams;

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getResult() {
            return result;
        }

        public void setResult(String result) {
            this.result = result;
        }

        public int getDuration() {
            return duration;
        }

        public void setDuration(int duration) {
            this.duration = duration;
        }

        public Player getStarPlayer() {
            return starPlayer;
        }

        public void setStarPlayer(Player starPlayer) {
            this.starPlayer = starPlayer;
        }

        public List<List<Player>> getTeams() {
            return teams;
        }

        public void setTeams(List<List<Player>> teams) {
            this.teams = teams;
        }
    }

    public static class Player {
        private String tag;
        private String name;
        private Brawler brawler;

        public String getTag() {
            return tag;
        }

        public void setTag(String tag) {
            this.tag = tag;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Brawler getBrawler() {
            return brawler;
        }

        public void setBrawler(Brawler brawler) {
            this.brawler = brawler;
        }
    }

    public static class Brawler {
        private int id;
        private String name;
        private int power;
        private int trophies;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public int getPower() {
            return power;
        }

        public void setPower(int power) {
            this.power = power;
        }

        public int getTrophies() {
            return trophies;
        }

        public void setTrophies(int trophies) {
            this.trophies = trophies;
        }
    }
}
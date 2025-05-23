package com.picker.back.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "player_name_cache")
public class PlayerNameCacheEntry {

    @Id
    private String playerTag;

    private String playerName;

    private OffsetDateTime lastFetched;

    public PlayerNameCacheEntry() {
    }

    public PlayerNameCacheEntry(String playerTag, String playerName) {
        this.playerTag = playerTag;
        this.playerName = playerName;
        this.lastFetched = OffsetDateTime.now();
    }

    public String getPlayerTag() {
        return playerTag;
    }

    public void setPlayerTag(String playerTag) {
        this.playerTag = playerTag;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public OffsetDateTime getLastFetched() {
        return lastFetched;
    }

    public void setLastFetched(OffsetDateTime lastFetched) {
        this.lastFetched = lastFetched;
    }

    public void updateName(String newPlayerName) {
        this.playerName = newPlayerName;
        this.lastFetched = OffsetDateTime.now();
    }
}
package com.picker.back.model.dto;

import java.math.BigDecimal;

public class PlayerDTO {
    private String playerName;
    private String playerTag;
    private Long wins;
    private Long losses;
    private BigDecimal winrate;

    public PlayerDTO(String playerTag, Long wins) {
        this.playerTag = playerTag;
        this.wins = wins;
    }

    public PlayerDTO(String playerTag, Long wins, Long losses, BigDecimal winrate) {
        this.playerTag = playerTag;
        this.wins = wins;
        this.losses = losses;
        this.winrate = winrate;
    }

    public PlayerDTO(String playerName, String playerTag, Long wins, Long losses, BigDecimal winrate) {
        this.playerName = playerName;
        this.playerTag = playerTag;
        this.wins = wins;
        this.losses = losses;
        this.winrate = winrate;
    }
    public String getPlayerName() {
        return playerName;
    }
    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }
    public String getPlayerTag() {
        return playerTag;
    }
    public void setPlayerTag(String playerTag) {
        this.playerTag = playerTag;
    }
    public Long getWins() {
        return wins;
    }
    public void setWins(Long wins) {
        this.wins = wins;
    }
    public Long getLosses() {
        return losses;
    }
    public void setLosses(Long losses) {
        this.losses = losses;
    }
    public BigDecimal getWinrate() {
        return winrate;
    }
    public void setWinrate(BigDecimal winrate) {
        this.winrate = winrate;
    }
}

// filepath: src/main/java/com/picker/back/model/entity/LegendaryIdEntity.java
package com.picker.back.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "legendary_ids")
public class LegendaryIdEntity {

    @Id
    private String playerTag;

    public LegendaryIdEntity() {
    }

    public LegendaryIdEntity(String playerTag) {
        this.playerTag = playerTag;
    }

    public String getPlayerTag() {
        return playerTag;
    }

    public void setPlayerTag(String playerTag) {
        this.playerTag = playerTag;
    }
}
// filepath: src/main/java/com/picker/back/model/entity/MastersIdEntity.java
package com.picker.back.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "masters_ids")
public class MastersIdEntity {

    @Id
    private String playerTag;

    public MastersIdEntity() {
    }

    public MastersIdEntity(String playerTag) {
        this.playerTag = playerTag;
    }

    public String getPlayerTag() {
        return playerTag;
    }

    public void setPlayerTag(String playerTag) {
        this.playerTag = playerTag;
    }
}
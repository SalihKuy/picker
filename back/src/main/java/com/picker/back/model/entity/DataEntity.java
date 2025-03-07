package com.picker.back.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "data_entity2")
public class DataEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String map;
    private String mode;
    private String blueBrawler1;
    private String blueBrawler2;
    private String blueBrawler3;
    private String redBrawler1;
    private String redBrawler2;
    private String redBrawler3;
    private Boolean isTwoOh;
    private OffsetDateTime battleTime;

    public DataEntity() {}

    public DataEntity(String map, String mode, String blueBrawler1, String blueBrawler2, String blueBrawler3, 
                      String redBrawler1, String redBrawler2, String redBrawler3, Boolean isTwoOh, 
                      OffsetDateTime battleTime) {
        this.map = map;
        this.mode = mode;
        this.blueBrawler1 = blueBrawler1;
        this.blueBrawler2 = blueBrawler2;
        this.blueBrawler3 = blueBrawler3;
        this.redBrawler1 = redBrawler1;
        this.redBrawler2 = redBrawler2;
        this.redBrawler3 = redBrawler3;
        this.isTwoOh = isTwoOh;
        this.battleTime = battleTime;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }
    
    public String getMap() { 
        return map; 
    }
    
    public void setMap(String map) { 
        this.map = map; 
    }
    
    public String getMode() { 
        return mode; 
    }
    
    public void setMode(String mode) { 
        this.mode = mode; 
    }
    
    public String getBlueBrawler1() { 
        return blueBrawler1; 
    }
    
    public void setBlueBrawler1(String blueBrawler1) { 
        this.blueBrawler1 = blueBrawler1; 
    }
    
    public String getBlueBrawler2() { 
        return blueBrawler2; 
    }
    
    public void setBlueBrawler2(String blueBrawler2) { 
        this.blueBrawler2 = blueBrawler2; 
    }
    
    public String getBlueBrawler3() { 
        return blueBrawler3; 
    }
    
    public void setBlueBrawler3(String blueBrawler3) { 
        this.blueBrawler3 = blueBrawler3; 
    }
    
    public String getRedBrawler1() { 
        return redBrawler1; 
    }
    
    public void setRedBrawler1(String redBrawler1) { 
        this.redBrawler1 = redBrawler1; 
    }
    
    public String getRedBrawler2() { 
        return redBrawler2; 
    }
    
    public void setRedBrawler2(String redBrawler2) { 
        this.redBrawler2 = redBrawler2; 
    }
    
    public String getRedBrawler3() { 
        return redBrawler3; 
    }
    
    public void setRedBrawler3(String redBrawler3) { 
        this.redBrawler3 = redBrawler3; 
    }
    
    public Boolean getIsTwoOh() { 
        return isTwoOh; 
    }
    
    public void setIsTwoOh(Boolean isTwoOh) { 
        this.isTwoOh = isTwoOh; 
    }
    
    public OffsetDateTime getBattleTime() { 
        return battleTime; 
    }
    
    public void setBattleTime(OffsetDateTime battleTime) { 
        this.battleTime = battleTime; 
    }
}
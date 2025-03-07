package com.picker.back.service;

import java.time.OffsetDateTime;
import java.util.Optional;

import com.picker.back.model.entity.DataEntity;

public interface DataService {
    DataEntity saveData(DataEntity dataEntity);
    Optional<DataEntity> findDataByTime(OffsetDateTime battleTime);
}
package com.picker.back.service;

import org.springframework.stereotype.Service;

import com.picker.back.model.entity.DataEntity;
import com.picker.back.repository.DataRepository;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
public class DataServiceImpl implements DataService {

    private final DataRepository dataRepository;

    public DataServiceImpl(DataRepository dataRepository) {
        this.dataRepository = dataRepository;
    }

    @Override
    public DataEntity saveData(DataEntity dataEntity) {
        return dataRepository.save(dataEntity);
    }

    @Override
    public Optional<DataEntity> findDataByTime(OffsetDateTime battleTime) {
        return dataRepository.findByBattleTime(battleTime);
    }
}
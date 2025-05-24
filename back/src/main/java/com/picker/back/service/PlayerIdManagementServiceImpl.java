package com.picker.back.service;

import com.picker.back.model.entity.LegendaryIdEntity;
import com.picker.back.model.entity.MastersIdEntity;
import com.picker.back.repository.LegendaryIdRepository;
import com.picker.back.repository.MastersIdRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PlayerIdManagementServiceImpl implements PlayerIdManagementService {

    private static final Logger logger = LoggerFactory.getLogger(PlayerIdManagementServiceImpl.class);
    private LegendaryIdRepository legendaryIdRepository;
    private MastersIdRepository mastersIdRepository;

    public PlayerIdManagementServiceImpl(LegendaryIdRepository legendaryIdRepository,
            MastersIdRepository mastersIdRepository) {
        this.legendaryIdRepository = legendaryIdRepository;
        this.mastersIdRepository = mastersIdRepository;
    }

    public void managePlayerId(String playerId, boolean isMasters) {
        logger.info("Processing playerId: {}, isMasters: {}", playerId, isMasters);

        String trimmedPlayerId = playerId.trim();
        if (trimmedPlayerId.isEmpty()) {
            logger.warn("Received empty playerId, skipping processing.");
            return;
        }

        if (!isMasters) {
            if (!legendaryIdRepository.existsById(trimmedPlayerId)) {
                legendaryIdRepository.save(new LegendaryIdEntity(trimmedPlayerId));
                logger.info("Saved new LegendaryIdEntity with ID: {}", trimmedPlayerId);
            }
        } else if (isMasters) {
            if (legendaryIdRepository.existsById(trimmedPlayerId)) {
                legendaryIdRepository.deleteById(trimmedPlayerId);
                logger.info("Deleted LegendaryIdEntity with ID: {}", trimmedPlayerId);
            } else {
                if (mastersIdRepository.existsById(trimmedPlayerId)) {
                    return;
                } else {
                    mastersIdRepository.save(new MastersIdEntity(trimmedPlayerId));
                    logger.info("Saved new MastersIdEntity with ID: {}", trimmedPlayerId);
                }
            }
        }
    }
}
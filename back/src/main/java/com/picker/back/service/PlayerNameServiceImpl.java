package com.picker.back.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.picker.back.config.ApiProperties;

@Service
public class PlayerNameServiceImpl implements PlayerNameService {
    private static final Logger logger = LoggerFactory.getLogger(PlayerNameServiceImpl.class);

    private final RestTemplate restTemplate;
    private final ApiProperties apiProperties;
    private final ObjectMapper objectMapper;

    public PlayerNameServiceImpl(RestTemplate restTemplate, ApiProperties apiProperties, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.apiProperties = apiProperties;
        this.objectMapper = objectMapper;
    }

    @Override
    public String getPlayerNameByTag(String playerTag) {
        logger.info("Getting API response for playerTag: {}", playerTag);

        try {
            String url = apiProperties.getBaseUrl() + "/players/{playerTag}";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiProperties.getApiKey());
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    String.class,
                    playerTag
            );

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            if (rootNode.has("name")) {
                return rootNode.get("name").asText();
            } else {
                logger.warn("Response for playerTag {} did not contain a 'name' field.", playerTag);
                return null;
            }
        } catch (RestClientException e) {
            logger.error("Error occurred while calling API for playerTag {}: {}", playerTag, e.getMessage());
            return null;
        } catch (Exception e) {
            logger.error("Unexpected error while processing playerTag {}: {}", playerTag, e.getMessage());
            return null;
        }
    }
}
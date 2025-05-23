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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.picker.back.config.ApiProperties;
import com.picker.back.model.dto.ApiResponseDTO;

@Service
public class ApiServiceImpl implements ApiService {
    private static final Logger logger = LoggerFactory.getLogger(ApiServiceImpl.class);

    private final RestTemplate restTemplate;
    private final ApiProperties apiProperties;
    private final ObjectMapper objectMapper;

    public ApiServiceImpl(RestTemplate restTemplate, ApiProperties apiProperties, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.apiProperties = apiProperties;
        this.objectMapper = objectMapper;
    }

    @Override
    public ApiResponseDTO getApiResponse(String playerTag) {
        logger.info("Getting API response");

        try {
            String url = apiProperties.getBaseUrl() + "/players/{playerTag}/battlelog";

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

            return objectMapper.readValue(response.getBody(), ApiResponseDTO.class);
        } catch (RestClientException e) {
            logger.error("Error occurred while calling API for playerTag {}: {}", playerTag, e.getMessage());
            if (e.getMessage() != null && e.getMessage().contains("selector manager closed")) {
                logger.error("Critical API error: 'selector manager closed' detected for playerTag {}. Initiating application shutdown to allow for restart.", playerTag, e);
                System.exit(1);
            }
            return new ApiResponseDTO();
        } catch (Exception e) {
            logger.error("Unexpected error for playerTag {}: {}", playerTag, e.getMessage(), e);
            return new ApiResponseDTO();
        }
    }
}
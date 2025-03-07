package com.picker.back.service;

import com.picker.back.model.dto.ApiResponseDTO;

public interface ApiService {
    ApiResponseDTO getApiResponse(String playerTag);
}
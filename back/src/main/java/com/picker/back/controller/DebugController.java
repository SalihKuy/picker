package com.picker.back.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.picker.back.scheduler.DataFetchScheduler;

@RestController
public class DebugController {

    private final DataFetchScheduler dataFetchScheduler;

    public DebugController(DataFetchScheduler dataFetchScheduler) {
        this.dataFetchScheduler = dataFetchScheduler;
    }

    @PostMapping("/api/debug/fetch-data")
    public String fetchDataManually(@RequestParam String playerTag) {
        dataFetchScheduler.fetchDataAndSave(playerTag);
        return "Data fetch initiated for player tag: " + playerTag;
    }
}
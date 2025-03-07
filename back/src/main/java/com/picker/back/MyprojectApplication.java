package com.picker.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.picker.back.config.ApiProperties;

@SpringBootApplication
@EntityScan(basePackages = "com.picker.back.model.entity")
@EnableConfigurationProperties(ApiProperties.class)
@EnableJpaRepositories(basePackages = "com.picker.back.repository")
@EnableScheduling
public class MyprojectApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyprojectApplication.class, args);
    }
}
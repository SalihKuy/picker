package com.picker.back.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

public class FileUtil {

    private FileUtil() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static List<String> readPlayerTagsFromFile(String filePathString) throws IOException {
        List<String> playerTags = new ArrayList<>();
        Path filePath = Paths.get(filePathString);

        try (BufferedReader reader = Files.newBufferedReader(filePath, StandardCharsets.UTF_8)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmedLine = line.trim();
                if (!trimmedLine.isEmpty()) {
                    playerTags.add(trimmedLine);
                }
            }
        } catch (NoSuchFileException e) {
            throw e;
        }
        return playerTags;
    }

    public static void appendPlayerTagsToFile(String filename, List<String> newTags) throws IOException {
        if (newTags == null || newTags.isEmpty()) {
            return;
        }

        Path filePath = Paths.get(filename);
        Set<String> existingTags = new HashSet<>();
        
        if (Files.exists(filePath)) {
            try (BufferedReader reader = Files.newBufferedReader(filePath, StandardCharsets.UTF_8)) {
                String line;
                while ((line = reader.readLine()) != null) {
                    String trimmedLine = line.trim();
                    if (!trimmedLine.isEmpty()) {
                        existingTags.add(trimmedLine);
                    }
                }
            }
        }

        List<String> tagsToAppend = new ArrayList<>();
        for (String tag : newTags) {
            String trimmedTag = tag.trim();
            if (!trimmedTag.isEmpty() && !existingTags.contains(trimmedTag)) {
                tagsToAppend.add(trimmedTag);
                existingTags.add(trimmedTag); 
            }
        }

        if (!tagsToAppend.isEmpty()) {
            try (BufferedWriter writer = Files.newBufferedWriter(filePath,
                    StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE,
                    StandardOpenOption.APPEND)) {

                for (String tag : tagsToAppend) {
                    writer.write(tag);
                    writer.newLine();
                }
            }
        }
    }
}
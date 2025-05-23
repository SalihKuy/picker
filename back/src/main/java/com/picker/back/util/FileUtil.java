package com.picker.back.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;

public class FileUtil {

    private FileUtil() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static List<String> readPlayerTagsFromFile(String fileName) throws IOException {
        List<String> playerTags = new ArrayList<>();
        try (InputStream inputStream = FileUtil.class.getClassLoader().getResourceAsStream(fileName);
                BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                playerTags.add(line.trim());
            }
        }
        return playerTags;
    }

    public static void appendPlayerTagsToFile(String filename, List<String> tags) throws IOException {
        if (tags == null || tags.isEmpty()) {
            return;
        }

        Path filePath = Paths.get(filename);

        try (BufferedWriter writer = Files.newBufferedWriter(filePath,
                StandardCharsets.UTF_8,
                StandardOpenOption.CREATE,
                StandardOpenOption.APPEND)) {

            for (String tag : tags) {
                writer.write(tag);
                writer.newLine();
            }
        }
    }
}
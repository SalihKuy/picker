package com.picker.back.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.net.URL;

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

        String projectDir = System.getProperty("user.dir");
        Path sourcePath = Paths.get(projectDir, "src", "main", "resources", filename);

        URL resourceUrl = FileUtil.class.getClassLoader().getResource(filename);
        Path targetPath = null;
        if (resourceUrl != null) {
            try {
                targetPath = Paths.get(resourceUrl.toURI());
            } catch (URISyntaxException e) {
                System.err.println("Error accessing runtime resource: " + e.getMessage());
            }
        }

        for (Path path : Arrays.asList(sourcePath, targetPath)) {
            if (path == null || !Files.exists(path)) {
                continue;
            }

            String existingContent = "";
            if (Files.size(path) > 0) {
                existingContent = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
            }

            try (BufferedWriter writer = Files.newBufferedWriter(path,
                    StandardCharsets.UTF_8,
                    StandardOpenOption.APPEND)) {
                if (!existingContent.isEmpty() && !existingContent.endsWith("\n")) {
                    writer.write("\n");
                }

                for (String tag : tags) {
                    writer.write(tag + "\n");
                }
            }
        }
    }
}
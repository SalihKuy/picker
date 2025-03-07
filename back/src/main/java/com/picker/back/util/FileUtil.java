package com.picker.back.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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
}
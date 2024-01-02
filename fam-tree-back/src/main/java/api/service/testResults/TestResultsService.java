package api.service.testResults;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

import api.model.testResult.TestResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TestResultsService {
    public Map<String, TestResult> fetchAllResults() {
        File reportsDir = new File("target/surefire-reports");
        File[] files = reportsDir.listFiles((dir, name) -> name.endsWith(".txt"));

        Map<String, TestResult> results = new HashMap<>();
        if (files != null) {
            for (File file : files) {
                String content = readFileContent(file);
                TestResult result = parseTestResult(content);
                results.put(file.getName().replace(".txt", ""), result);
            }
        }

        return results;
    }

    public String readFileContent(File file) {
        try {
            return new String(Files.readAllBytes(file.toPath()));
        } catch (IOException e) {
            return "";
        }
    }

    public TestResult parseTestResult(String content) {
        Pattern pattern = Pattern.compile("Tests run: (\\d+), Failures: (\\d+), Errors: (\\d+), Skipped: (\\d+), Time elapsed: ([\\d.]+)");
        Matcher matcher = pattern.matcher(content);

        if (matcher.find()) {
            int testsRun = Integer.parseInt(matcher.group(1));
            int failures = Integer.parseInt(matcher.group(2));
            int errors = Integer.parseInt(matcher.group(3));
            int skipped = Integer.parseInt(matcher.group(4));
            double timeElapsed = Double.parseDouble(matcher.group(5));

            return new TestResult(testsRun, failures, errors, skipped, timeElapsed);
        }
        return null;
    }


}
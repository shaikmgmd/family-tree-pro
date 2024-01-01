package api.controller.testResult;

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

import api.common.ApiResponse;
import api.model.testResult.TestResult;
import api.service.testResults.TestResultsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test-results")
@RequiredArgsConstructor
public class TestResultsController {
private final TestResultsService testResultsService;
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, TestResult>>> getAllTestResults() {
        ApiResponse<Map<String, TestResult>> response = new ApiResponse<>(testResultsService.fetchAllResults());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
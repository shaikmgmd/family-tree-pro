package api.model.testResult;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TestResult {
    private int testsRun;
    private int failures;
    private int errors;
    private int skipped;
    private double timeElapsed;

}


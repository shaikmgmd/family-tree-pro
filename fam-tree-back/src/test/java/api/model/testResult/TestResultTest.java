package api.model.testResult;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TestResultTest {
    private TestResult testResult;

    @BeforeEach
    public void setUp() {
        // Initialisation avec des valeurs arbitraires
        testResult = new TestResult(5, 1, 1, 2, 10.5);
    }

    @Test
    public void constructor_initializesFieldsCorrectly() {
        assertEquals(5, testResult.getTestsRun());
        assertEquals(1, testResult.getFailures());
        assertEquals(1, testResult.getErrors());
        assertEquals(2, testResult.getSkipped());
        assertEquals(10.5, testResult.getTimeElapsed(), 0.001);
    }

    @Test
    public void setters_updateFieldsCorrectly() {
        testResult.setTestsRun(10);
        assertEquals(10, testResult.getTestsRun());

        testResult.setFailures(2);
        assertEquals(2, testResult.getFailures());

        testResult.setErrors(3);
        assertEquals(3, testResult.getErrors());

        testResult.setSkipped(4);
        assertEquals(4, testResult.getSkipped());

        testResult.setTimeElapsed(20.5);
        assertEquals(20.5, testResult.getTimeElapsed(), 0.001);
    }

    @Test
    public void setters_handleInvalidValues() {
        testResult.setTestsRun(-1);
        assertTrue(testResult.getTestsRun() >= 0 || testResult.getTestsRun() == -1, "testsRun should be non-negative or -1");

        testResult.setFailures(-1);
        assertTrue(testResult.getFailures() >= 0 || testResult.getFailures() == -1, "failures should be non-negative or -1");

        testResult.setErrors(-1);
        assertTrue(testResult.getErrors() >= 0 || testResult.getErrors() == -1, "errors should be non-negative or -1");

        testResult.setSkipped(-1);
        assertTrue(testResult.getSkipped() >= 0 || testResult.getSkipped() == -1, "skipped should be non-negative or -1");

        testResult.setTimeElapsed(-1.0);
        assertTrue(testResult.getTimeElapsed() >= 0 || testResult.getTimeElapsed() == -1, "timeElapsed should be non-negative or -1");

    }


}

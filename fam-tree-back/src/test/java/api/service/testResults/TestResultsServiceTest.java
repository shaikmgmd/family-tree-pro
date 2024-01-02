package api.service.testResults;

import api.model.testResult.TestResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TestResultsServiceTest {

    @InjectMocks
    private TestResultsService testResultsService;

    private File mockFile;

    @BeforeEach
    public void setUp() {
        mockFile = mock(File.class);
        // Configurez ici le comportement de mockFile si nécessaire
    }


    @Test
    public void readFileContent_ReturnsContent() {
        File tempFile = null;
        try {
            // Créer un fichier temporaire avec du contenu
            tempFile = File.createTempFile("test", null);
            String content = "Dummy content";
            Files.write(tempFile.toPath(), content.getBytes());

            // Appeler la méthode
            String fileContent = testResultsService.readFileContent(tempFile);

            // Vérifier le contenu
            assertNotNull(fileContent);
            assertEquals(content, fileContent);
        } catch (IOException e) {
            fail("IOException should not be thrown");
        } finally {
            // Nettoyer le fichier temporaire
            if (tempFile != null) {
                tempFile.delete();
            }
        }
    }

    @Test
    public void parseTestResult_ReturnsCorrectObject() {
        String content = "Tests run: 10, Failures: 2, Errors: 1, Skipped: 3, Time elapsed: 0.123";
        TestResult result = testResultsService.parseTestResult(content);

        assertNotNull(result);
        assertEquals(10, result.getTestsRun());
        assertEquals(2, result.getFailures());
        assertEquals(1, result.getErrors());
        assertEquals(3, result.getSkipped());
        assertEquals(0.123, result.getTimeElapsed(), 0.001);
    }

    @Test
    public void parseTestResult_InvalidContent_ReturnsNull() {
        String content = "Invalid content";
        TestResult result = testResultsService.parseTestResult(content);
        assertNull(result);
    }

}

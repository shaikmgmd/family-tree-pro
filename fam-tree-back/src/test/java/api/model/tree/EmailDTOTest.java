package api.model.tree;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EmailDTOTest {
    @Test
    public void givenEmailDTO_whenSetEmail_thenCorrect() {
        // Arrange
        EmailDTO dto = new EmailDTO();
        String testEmail = "test@example.com";

        // Act
        dto.setEmail(testEmail);

        // Assert
        assertEquals(testEmail, dto.getEmail(), "The email should match the one that was set");
    }

    @Test
    public void givenEmailDTO_whenSetNodeId_thenCorrect() {
        // Arrange
        EmailDTO dto = new EmailDTO();
        Long testNodeId = 123L;

        // Act
        dto.setNodeId(testNodeId);

        // Assert
        assertEquals(testNodeId, dto.getNodeId(), "The nodeId should match the one that was set");
    }
}

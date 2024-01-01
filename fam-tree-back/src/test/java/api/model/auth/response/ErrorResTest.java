package api.model.auth.response;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;


import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ErrorResTest {

    @Test
    void testErrorResConstructorAndGetters() {
        ErrorRes errorRes = new ErrorRes(HttpStatus.BAD_REQUEST, "Error message");

        // Vérifier que le constructeur initialise correctement les valeurs
        assertEquals(HttpStatus.BAD_REQUEST, errorRes.getHttpStatus());
        assertEquals("Error message", errorRes.getMessage());
    }

    @Test
    void testSetters() {
        ErrorRes errorRes = new ErrorRes(HttpStatus.OK, "Initial message");

        // Modifier les valeurs à l'aide des setters
        errorRes.setHttpStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        errorRes.setMessage("Updated error message");

        // Vérifier que les valeurs ont été mises à jour
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, errorRes.getHttpStatus());
        assertEquals("Updated error message", errorRes.getMessage());
    }
}

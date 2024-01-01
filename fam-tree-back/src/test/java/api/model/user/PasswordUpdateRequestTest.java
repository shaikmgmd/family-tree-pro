package api.model.user;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PasswordUpdateRequestTest {
    @Test
    void testPasswordUpdateRequestSetAndGet() {
        // Créer une instance de PasswordUpdateRequest
        PasswordUpdateRequest request = new PasswordUpdateRequest();

        // Définir des valeurs de test
        String testPrivateCode = "TestPrivateCode";
        String testNewPassword = "TestNewPassword";

        // Utiliser les setters pour attribuer les valeurs
        request.setPrivateCode(testPrivateCode);
        request.setNewPassword(testNewPassword);

        // Utiliser les getters pour vérifier si les valeurs sont correctement attribuées
        assertEquals(testPrivateCode, request.getPrivateCode(), "Le privateCode doit correspondre à celui défini.");
        assertEquals(testNewPassword, request.getNewPassword(), "Le nouveau mot de passe doit correspondre à celui défini.");
    }
}

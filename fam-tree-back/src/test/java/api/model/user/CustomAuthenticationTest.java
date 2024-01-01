package api.model.user;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CustomAuthenticationTest {
    @Test
    void customAuthenticationCreationAndAttributesTest() {
        // Définir des valeurs pour la création de CustomAuthentication
        String privateCode = "PRIVATE123";
        String token = "TOKEN123";

        // Créer une instance de CustomAuthentication
        CustomAuthentication customAuth = new CustomAuthentication(privateCode, token);

        // Vérifier que le privateCode est correctement défini
        assertEquals(privateCode, customAuth.getPrincipal());

        // Vérifier que le token est correctement défini et récupérable
        assertEquals(token, customAuth.getToken());

        // Vérifier que l'authentification ne possède pas de credentials
        assertNull(customAuth.getCredentials());

        // Vérifier que l'authentification ne possède pas d'autorités
        assertTrue(customAuth.getAuthorities().isEmpty());
    }
}

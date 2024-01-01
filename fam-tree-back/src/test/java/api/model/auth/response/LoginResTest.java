package api.model.auth.response;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;


import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class LoginResTest {
    @Test
    void testLoginResConstructorAndGetters() {
        List<String> roles = Arrays.asList("ROLE_USER", "ROLE_ADMIN");
        LoginRes loginRes = new LoginRes("privateCode123", "tokenXYZ", roles);

        // Vérifier que le constructeur initialise correctement les valeurs
        assertEquals("privateCode123", loginRes.getPrivateCode());
        assertEquals("tokenXYZ", loginRes.getToken());
        assertEquals(roles, loginRes.getRoles());
    }

    @Test
    void testSetters() {
        List<String> initialRoles = Arrays.asList("ROLE_USER");
        LoginRes loginRes = new LoginRes("initialCode", "initialToken", initialRoles);

        // Modifier les valeurs à l'aide des setters
        loginRes.setPrivateCode("updatedCode");
        loginRes.setToken("updatedToken");
        List<String> updatedRoles = Arrays.asList("ROLE_ADMIN");
        loginRes.setRoles(updatedRoles);

        // Vérifier que les valeurs ont été mises à jour
        assertEquals("updatedCode", loginRes.getPrivateCode());
        assertEquals("updatedToken", loginRes.getToken());
        assertEquals(updatedRoles, loginRes.getRoles());
    }
}

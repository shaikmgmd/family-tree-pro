package api.model.role;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class RoleTest {
    @Test
    void testRoleGettersAndSetters() {
        // Créer une instance de Role
        Role role = new Role();

        // Définir des valeurs
        Long expectedId = 1L;
        String expectedName = "ROLE_USER";

        role.setId(expectedId);
        role.setName(expectedName);

        // Vérifier les getters
        assertEquals(expectedId, role.getId());
        assertEquals(expectedName, role.getName());
    }
}

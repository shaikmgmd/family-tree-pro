package api.model.user;

import api.model.user_role.UserRole;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserRelationsTest {
    @Test
    void testUserRolesRelation() {
        User user = new User();
        UserRole role = new UserRole();
        user.getUserRoles().add(role);
        assertTrue(user.getUserRoles().contains(role), "Le rôle doit être présent dans l'ensemble des rôles de l'utilisateur.");
    }
}

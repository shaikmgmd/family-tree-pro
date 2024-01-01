package api.model.user_role;

import api.model.role.Role;
import api.model.user.User;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserRoleTest {
    @Test
    void testUserAssociation() {
        UserRole userRole = new UserRole();
        User user = new User(); // Assume User is a properly instantiated object
        userRole.setUser(user);

        assertEquals(user, userRole.getUser(), "The User should be associated with the UserRole");
    }

    @Test
    void testRoleAssociation() {
        UserRole userRole = new UserRole();
        Role role = new Role(); // Assume Role is a properly instantiated object
        userRole.setRole(role);

        assertEquals(role, userRole.getRole(), "The Role should be associated with the UserRole");
    }
}

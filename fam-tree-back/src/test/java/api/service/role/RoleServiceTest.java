package api.service.role;

import api.model.role.Role;
import api.model.user.User;
import api.model.user_role.UserRole;
import api.repository.role.RoleRepository;
import api.repository.user.UserRepository;
import api.repository.user_role.UserRoleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RoleServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private UserRoleRepository userRoleRepository;

    @InjectMocks
    private RoleService roleService;

    private User user;
    private Role adminRole;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);

        adminRole = new Role();
        adminRole.setName("ADMIN");
    }

    @Test
    void addAdminRoleToUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findByName("ADMIN")).thenReturn(adminRole);

        String result = roleService.addAdminRoleToUser(1L);

        assertEquals("Nouveau ADMIN : 1", result);
        verify(userRoleRepository).save(any(UserRole.class));
    }

    @Test
    void addAdminRoleToUser_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            roleService.addAdminRoleToUser(1L);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void removeAdminRoleFromUser_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roleRepository.findByName("ADMIN")).thenReturn(adminRole);

        String result = roleService.removeAdminRoleFromUser(1L);

        assertEquals("Nouveau ADMIN retiré : 1", result);
        verify(userRoleRepository).deleteByUserAndRole(user, adminRole);
    }

    @Test
    void removeAdminRoleFromUser_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            roleService.removeAdminRoleFromUser(1L);
        });

        assertEquals("User not found", exception.getMessage());
    }
}

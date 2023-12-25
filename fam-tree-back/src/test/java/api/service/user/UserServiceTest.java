package api.service.user;

import api.model.user.User;
import api.model.user.UserUpdate;
import api.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getCurrentConnectedUserTest() {
        String privateCode = "code123";
        when(authentication.getPrincipal()).thenReturn(privateCode);
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(testUser);

        User result = userService.getCurrentConnectedUser();
        assertEquals(testUser, result);
    }

    @Test
    void updateUserTest_Success() {
        String privateCode = "code123";
        UserUpdate userUpdate = new UserUpdate("1234567890","New Address","newemail@example.com");

        when(authentication.getPrincipal()).thenReturn(privateCode);
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(testUser);
        when(userRepository.findByEmail(userUpdate.getEmail())).thenReturn(Optional.empty());

        User updatedUser = userService.updateUser(userUpdate);

        assertEquals(userUpdate.getEmail(), updatedUser.getEmail());
        assertEquals(userUpdate.getAddress(), updatedUser.getAddress());
        assertEquals(userUpdate.getPhone(), updatedUser.getPhone());
    }

    @Test
    void updateUserTest_UserNotFound() {
        String privateCode = "code123";
        UserUpdate userUpdate = new UserUpdate("","","");

        when(authentication.getPrincipal()).thenReturn(privateCode);
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(null);

        assertThrows(RuntimeException.class, () -> userService.updateUser(userUpdate));
    }

    @Test
    void updateUserTest_EmailAlreadyExists() {
        String privateCode = "code123";
        UserUpdate userUpdate = new UserUpdate("1234567890","New Address","existingemail@example.com");

        when(authentication.getPrincipal()).thenReturn(privateCode);
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(testUser);
        when(userRepository.findByEmail(userUpdate.getEmail())).thenReturn(Optional.of(new User()));

        assertThrows(RuntimeException.class, () -> userService.updateUser(userUpdate));
    }

}

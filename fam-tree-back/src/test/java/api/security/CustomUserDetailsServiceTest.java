package api.security;

import api.model.user.User;
import api.repository.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void whenUserExists_thenRetrieveUserDetails() {
        // Arrange
        String privateCode = "testPrivateCode";
        User mockUser = new User();
        mockUser.setPrivateCode(privateCode);
        mockUser.setPassword("testPassword");

        when(userRepository.findByPrivateCode(privateCode)).thenReturn(mockUser);

        // Act
        UserDetails loadedUser = userDetailsService.loadUserByUsername(privateCode);

        // Assert
        assertNotNull(loadedUser);
        assertEquals(privateCode, loadedUser.getUsername());
        assertEquals(mockUser.getPassword(), loadedUser.getPassword());

    }

    @Test
    public void whenUserDoesNotExist_thenThrowException() {
        // Arrange
        String privateCode = "nonExistentCode";
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(null);

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(privateCode));
    }
}

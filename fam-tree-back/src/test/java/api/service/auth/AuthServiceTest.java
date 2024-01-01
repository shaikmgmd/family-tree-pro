package api.service.auth;


import api.model.adhesion.AdhesionRequest;
import api.model.auth.request.LoginReq;
import api.model.auth.response.LoginRes;
import api.model.role.Role;
import api.model.tree.FamilyTree;
import api.model.user.User;
import api.repository.adhesion.AdhesionRepository;
import api.repository.role.RoleRepository;
import api.repository.tree.FamilyTreeRepository;
import api.repository.user.UserRepository;
import api.security.JwtUtil;
import api.service.mail.MailService;
import api.utils.CodeUtils;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AdhesionRepository adhesionRepository;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private MailService emailService;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private FamilyTreeRepository familyTreeRepository;



    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setPrivateCode("privateCode");
        CodeUtils.setUserRepository(userRepository);
        lenient().when(roleRepository.findByName(anyString())).thenReturn(new Role());
        lenient().when(familyTreeRepository.save(any())).thenReturn(new FamilyTree());
    }

    @Test
    void loginSuccessTest() {
        String privateCode = "privateCode";
        String password = "password";
        String token = "token";
        testUser.setPrivateCode(privateCode);

        LoginReq loginReq = new LoginReq(privateCode, password);
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getName()).thenReturn(privateCode);
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(testUser);
        when(jwtUtil.createToken(testUser)).thenReturn(token);

        LoginRes result = authService.login(loginReq);

        assertNotNull(result);
        assertEquals(token, result.getToken());
    }

    @Test
    void loginFailureTest() {
        LoginReq loginReq = new LoginReq("privateCode", "wrongPassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid private code or password"));

        assertThrows(ResponseStatusException.class, () -> authService.login(loginReq));
    }

    @Test
    void approveAdhesionTest() {
        AdhesionRequest request = new AdhesionRequest();
        request.setEmail("test@example.com");

        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.approveAdhesion(request);

        verify(userRepository).save(any(User.class));
        verify(emailService).sendCodesByEmail(anyString(), anyString(), anyString());
    }


    @Test
    void handleFirstLoginPasswordUpdateSuccessTest() {
        String privateCode = "privateCode";
        String newPassword = "newPassword";
        testUser.setFirstLogin(true);

        when(userRepository.findByPrivateCode(privateCode)).thenReturn(testUser);
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedPassword");
        when(userRepository.save(testUser)).thenReturn(testUser);

        User updatedUser = authService.handleFirstLoginPasswordUpdate(privateCode, newPassword);

        assertNotNull(updatedUser);
        assertFalse(updatedUser.isFirstLogin());
        assertEquals("encodedPassword", updatedUser.getPassword());
        verify(userRepository).save(testUser);
    }

    @Test
    void handleFirstLoginPasswordUpdateUserNotFoundTest() {
        String privateCode = "invalidCode";
        when(userRepository.findByPrivateCode(privateCode)).thenReturn(null);

        assertThrows(RuntimeException.class, () -> authService.handleFirstLoginPasswordUpdate(privateCode, "newPassword"));
    }

    @Test
    void handleFirstLoginPasswordUpdatePasswordAlreadySetTest() {
        String privateCode = "privateCode";
        testUser.setFirstLogin(false);

        when(userRepository.findByPrivateCode(privateCode)).thenReturn(testUser);

        assertThrows(RuntimeException.class, () -> authService.handleFirstLoginPasswordUpdate(privateCode, "newPassword"));
    }

}

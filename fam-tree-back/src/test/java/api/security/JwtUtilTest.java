package api.security;

import api.model.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.AuthenticationException;

import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
public class JwtUtilTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private User user;

    @Mock
    private Claims claims;

    @InjectMocks
    private JwtUtil jwtUtil;

    private String testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0UHJpdmF0ZUNvZGUiLCJleHAiOjE2MTc1MjY0MDB9.K7gNU3sdoOEThNSCh3gXhKF8C1Z6yqZj5lZ5ZG1FNjU";

    private final String testPrivateCode = "testPrivateCode";

    @BeforeEach
    void setUp() {
        lenient().when(request.getHeader("Authorization")).thenReturn(testToken);
        lenient().when(user.getPrivateCode()).thenReturn(testPrivateCode);
        lenient().when(claims.getSubject()).thenReturn("testEmail@example.com");
        lenient().when(claims.getExpiration()).thenReturn(new Date(System.currentTimeMillis() + 100000));
        testToken = "Bearer " + jwtUtil.createToken(user);
    }

    @Test
    void createToken_Success() {
        String token = jwtUtil.createToken(user);
        assertNotNull(token);
    }

    @Test
    void resolveToken_InvalidHeader_Null() {
        when(request.getHeader("Authorization")).thenReturn(null);
        String token = jwtUtil.resolveToken(request);
        assertNull(token);
    }

    @Test
    void validateClaims_ValidClaims_ReturnTrue() {
        assertTrue(jwtUtil.validateClaims(claims));
    }

    @Test
    void getEmail_ValidClaims_ReturnEmail() {
        String email = jwtUtil.getEmail(claims);
        assertEquals("testEmail@example.com", email);
    }

    @Test
    void getRoles_ValidClaims_ReturnRoles() {
        when(claims.get("roles")).thenReturn(List.of("ROLE_USER", "ROLE_ADMIN"));
        List<String> roles = jwtUtil.getRoles(claims);
        assertNotNull(roles);
        assertTrue(roles.contains("ROLE_USER"));
        assertTrue(roles.contains("ROLE_ADMIN"));
    }

}

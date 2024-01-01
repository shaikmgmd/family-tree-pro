package api.security;

import api.repository.user.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class JwtAuthorizationFilterTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private Claims claims;

    @Mock
    private ObjectMapper mapper;


    @InjectMocks
    private JwtAuthorizationFilter jwtAuthorizationFilter;

    private static final String TEST_TOKEN = "Bearer test.token";
    private static final String PRIVATE_CODE = "testPrivateCode";

    @BeforeEach
    void setUp() throws JsonProcessingException {
        SecurityContextHolder.clearContext(); // Ensure it's clean before each test
        lenient().when(mapper.writeValueAsString(any())).thenAnswer(invocation -> {
            Object argument = invocation.getArgument(0);
            return "Error Details: " + argument.toString(); // Ou toute autre logique représentative
        });

    }

    @Test
    void whenTokenIsValid_thenAuthenticate() throws Exception {
        // Arrange
        when(jwtUtil.resolveToken(request)).thenReturn(TEST_TOKEN);
        when(jwtUtil.resolveClaims(request)).thenReturn(claims);
        when(jwtUtil.validateClaims(claims)).thenReturn(true);
        when(claims.getSubject()).thenReturn(PRIVATE_CODE);

        // Act
        jwtAuthorizationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        assertEquals(PRIVATE_CODE, authentication.getName());
        verify(filterChain, times(1)).doFilter(request, response);
    }


    @Test
    void whenTokenIsMissing_thenChainProceeds() throws Exception {
        // Arrange
        when(jwtUtil.resolveToken(request)).thenReturn(null);

        // Act
        jwtAuthorizationFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(filterChain, times(1)).doFilter(request, response);
    }

}

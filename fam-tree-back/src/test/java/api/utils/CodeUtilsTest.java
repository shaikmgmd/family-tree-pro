package api.utils;

import api.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CodeUtilsTest {

    @Mock
    private UserRepository userRepository;

    private CodeUtils codeUtils;

    @BeforeEach
    void setUp() {
        codeUtils = new CodeUtils(userRepository);
    }

    @Test
    void generatePublicCodeTest() {
        String publicCode = CodeUtils.generatePublicCode();

        assertNotNull(publicCode);
        assertTrue(publicCode.matches("\\d{8}"));
    }

    @Test
    void generatePrivateCodeTest() {
        when(userRepository.findByPrivateCode(anyString())).thenReturn(null);

        String privateCode = CodeUtils.generatePrivateCode();

        assertNotNull(privateCode);
        assertTrue(privateCode.matches("\\d{8}"));
        verify(userRepository).findByPrivateCode(anyString());
    }

}

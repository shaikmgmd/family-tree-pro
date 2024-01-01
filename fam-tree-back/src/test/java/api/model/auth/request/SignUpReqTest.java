package api.model.auth.request;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class SignUpReqTest {
    private SignUpReq signUpReq;

    @BeforeEach
    void setUp() {
        signUpReq = new SignUpReq();
        signUpReq.setEmail("test@example.com");
        signUpReq.setPassword("password123");
        signUpReq.setFirstName("John");
        signUpReq.setLastName("Doe");
    }

    @Test
    void testEmail() {
        assertEquals("test@example.com", signUpReq.getEmail());
        signUpReq.setEmail("newemail@example.com");
        assertEquals("newemail@example.com", signUpReq.getEmail());
    }

    @Test
    void testPassword() {
        assertEquals("password123", signUpReq.getPassword());
        signUpReq.setPassword("newpassword123");
        assertEquals("newpassword123", signUpReq.getPassword());
    }

    @Test
    void testFirstName() {
        assertEquals("John", signUpReq.getFirstName());
        signUpReq.setFirstName("Jane");
        assertEquals("Jane", signUpReq.getFirstName());
    }

    @Test
    void testLastName() {
        assertEquals("Doe", signUpReq.getLastName());
        signUpReq.setLastName("Smith");
        assertEquals("Smith", signUpReq.getLastName());
    }
}

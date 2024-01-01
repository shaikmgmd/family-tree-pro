package api.model.auth.request;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class LoginReqTest {
    private LoginReq loginReq;

    @BeforeEach
    void setUp() {
        loginReq = new LoginReq("myPrivateCode", "myPassword");
    }

    @Test
    void testPrivateCode() {
        // Verifying the privateCode set in the constructor
        assertEquals("myPrivateCode", loginReq.getPrivateCode());

        // Testing setter
        loginReq.setPrivateCode("newPrivateCode");
        assertEquals("newPrivateCode", loginReq.getPrivateCode());
    }

    @Test
    void testPassword() {
        // Verifying the password set in the constructor
        assertEquals("myPassword", loginReq.getPassword());

        // Testing setter
        loginReq.setPassword("newPassword");
        assertEquals("newPassword", loginReq.getPassword());
    }
}

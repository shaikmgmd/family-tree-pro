package api.model.user;

import api.model.user_role.UserRole;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;


import java.util.Date;
import java.util.HashSet;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserTest {
    @Test
    void testGettersAndSetters() {
        User user = new User();
        Date testDate = new Date();
        HashSet<UserRole> roles = new HashSet<>();

        user.setFirstName("TestFirstName");
        user.setLastName("TestLastName");
        user.setBirthDate(testDate);
        user.setNationality("TestNationality");
        user.setPublicCode("TestPublicCode");
        user.setPrivateCode("TestPrivateCode");
        user.setSocialSecurityNumber("TestSSN");
        user.setIdCardPath("TestIdCardPath");
        user.setPhotoPath("TestPhotoPath");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setFirstLogin(false);
        user.setUserRoles(roles);

        assertEquals("TestFirstName", user.getFirstName());
        assertEquals("TestLastName", user.getLastName());
        assertEquals(testDate, user.getBirthDate());
        assertEquals("TestNationality", user.getNationality());
        assertEquals("TestPublicCode", user.getPublicCode());
        assertEquals("TestPrivateCode", user.getPrivateCode());
        assertEquals("TestSSN", user.getSocialSecurityNumber());
        assertEquals("TestIdCardPath", user.getIdCardPath());
        assertEquals("TestPhotoPath", user.getPhotoPath());
        assertEquals("test@example.com", user.getEmail());
        assertEquals("testPassword", user.getPassword());
        assertFalse(user.isFirstLogin());
        assertEquals(roles, user.getUserRoles());
    }
}

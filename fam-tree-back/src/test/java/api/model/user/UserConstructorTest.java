package api.model.user;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserConstructorTest {
    @Test
    void testUserConstructor() {
        Date birthDate = new Date();
        User user = new User("Doe", "John", birthDate, "Nationality",
                "PublicCode", "PrivateCode", "SSN", "IdCardPath", "PhotoPath",
                "email@example.com", "password", "cergy", "france", "male");

        assertEquals("Doe", user.getLastName());
        assertEquals("John", user.getFirstName());
        assertEquals(birthDate, user.getBirthDate());
        assertEquals("Nationality", user.getNationality());
        assertEquals("PublicCode", user.getPublicCode());
        assertEquals("PrivateCode", user.getPrivateCode());
        assertEquals("SSN", user.getSocialSecurityNumber());
        assertEquals("IdCardPath", user.getIdCardPath());
        assertEquals("PhotoPath", user.getPhotoPath());
        assertEquals("email@example.com", user.getEmail());
        assertEquals("password", user.getPassword());
        assertEquals("cergy", user.getCity());
        assertEquals("france", user.getCountry());
        assertEquals("male", user.getGender());
    }
}

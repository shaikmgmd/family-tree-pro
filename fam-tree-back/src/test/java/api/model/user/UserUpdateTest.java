package api.model.user;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserUpdateTest {
    @Test
    void testGettersAndSetters() {
        UserUpdate userUpdate = new UserUpdate();

        // Test setting and getting the phone
        String testPhone = "1234567890";
        userUpdate.setPhone(testPhone);
        assertEquals(testPhone, userUpdate.getPhone(), "The phone should match what was set");

        // Test setting and getting the address
        String testAddress = "123 Test St";
        userUpdate.setAddress(testAddress);
        assertEquals(testAddress, userUpdate.getAddress(), "The address should match what was set");

        // Test setting and getting the email
        String testEmail = "test@example.com";
        userUpdate.setEmail(testEmail);
        assertEquals(testEmail, userUpdate.getEmail(), "The email should match what was set");
    }

    @Test
    void testConstructor() {
        String phone = "987654321";
        String address = "321 Test Ave";
        String email = "example@test.com";

        UserUpdate userUpdate = new UserUpdate(phone, address, email);

        assertEquals(phone, userUpdate.getPhone(), "Constructor should initialize phone");
        assertEquals(address, userUpdate.getAddress(), "Constructor should initialize address");
        assertEquals(email, userUpdate.getEmail(), "Constructor should initialize email");
    }
}

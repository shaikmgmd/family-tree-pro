package api.model.adhesion;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AdhesionRequestTest {
    private AdhesionRequest adhesionRequest;

    @BeforeEach
    void setUp() {
        adhesionRequest = new AdhesionRequest();
    }

    @Test
    void testSocialSecurityNumber() {
        String ssn = "123-45-6789";
        adhesionRequest.setSocialSecurityNumber(ssn);
        assertEquals(ssn, adhesionRequest.getSocialSecurityNumber());
    }

    @Test
    void testLastName() {
        String lastName = "Doe";
        adhesionRequest.setLastName(lastName);
        assertEquals(lastName, adhesionRequest.getLastName());
    }

    @Test
    void testFirstName() {
        String firstName = "John";
        adhesionRequest.setFirstName(firstName);
        assertEquals(firstName, adhesionRequest.getFirstName());
    }

    @Test
    void testBirthDate() {
        Date birthDate = new Date();
        adhesionRequest.setBirthDate(birthDate);
        assertEquals(birthDate, adhesionRequest.getBirthDate());
    }

    @Test
    void testNationality() {
        String nationality = "French";
        adhesionRequest.setNationality(nationality);
        assertEquals(nationality, adhesionRequest.getNationality());
    }

    @Test
    void testIdCardPath() {
        String path = "/path/to/id/card";
        adhesionRequest.setIdCardPath(path);
        assertEquals(path, adhesionRequest.getIdCardPath());
    }

    @Test
    void testPhotoPath() {
        String path = "/path/to/photo";
        adhesionRequest.setPhotoPath(path);
        assertEquals(path, adhesionRequest.getPhotoPath());
    }

    @Test
    void testEmail() {
        String email = "john.doe@example.com";
        adhesionRequest.setEmail(email);
        assertEquals(email, adhesionRequest.getEmail());
    }

    @Test
    void testStatus() {
        // Testing default status
        assertEquals(AdhesionStatus.PENDING, adhesionRequest.getStatus());

        // Testing status change
        adhesionRequest.setStatus(AdhesionStatus.APPROVED);
        assertEquals(AdhesionStatus.APPROVED, adhesionRequest.getStatus());
    }
}

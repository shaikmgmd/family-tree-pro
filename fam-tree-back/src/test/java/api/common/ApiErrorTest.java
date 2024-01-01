package api.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ApiErrorTest {

    @Test
    void createApiError_withDefaultConstructor() {
        ApiError error = new ApiError();
        assertNull(error.getCode());
        assertNull(error.getMessage());
        assertNull(error.getDetail());
    }

    @Test
    void createApiError_withParameterizedConstructor() {
        ApiError error = new ApiError("A0001", "Erreur d'authentification");
        assertEquals("A0001", error.getCode());
        assertEquals("Erreur d'authentification", error.getMessage());
        assertNull(error.getDetail());
    }

    @Test
    void setAndGetCode() {
        ApiError error = new ApiError();
        error.setCode("A0002");
        assertEquals("A0002", error.getCode());
    }

    @Test
    void setAndGetName() {
        ApiError error = new ApiError();
        error.setMessage("Test message");
        assertEquals("Test message", error.getMessage());
    }

    @Test
    void setAndGetDetail() {
        ApiError error = new ApiError();
        error.setDetail("Test detail");
        assertEquals("Test detail", error.getDetail());
    }

    @Test
    void addDetailToError() {
        ApiError error = new ApiError("A0003", "Another error");
        error.addDetail("Additional detail");
        assertEquals("A0003", error.getCode());
        assertEquals("Another error", error.getMessage());
        assertEquals("Additional detail", error.getDetail());
    }

}

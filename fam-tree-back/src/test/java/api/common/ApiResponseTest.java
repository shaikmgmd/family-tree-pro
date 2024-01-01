package api.common;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ApiResponseTest {
    @Test
    void createApiResponse_withDefaultConstructor() {
        ApiResponse<Object> response = new ApiResponse<>();
        assertNull(response.getContent());
        assertTrue(response.getErrors().isEmpty());
    }

    @Test
    void createApiResponse_withParameterizedConstructor() {
        String content = "Test Content";
        ApiResponse<String> response = new ApiResponse<>(content);
        assertEquals(content, response.getContent());
        assertTrue(response.getErrors().isEmpty());
    }

    @Test
    void createApiResponse_withStaticFromMethod() {
        Integer content = 123;
        ApiResponse<Integer> response = ApiResponse.from(content);
        assertEquals(content, response.getContent());
        assertTrue(response.getErrors().isEmpty());
    }

    @Test
    void setAndGetContent() {
        ApiResponse<String> response = new ApiResponse<>();
        String content = "New Content";
        response.setContent(content);
        assertEquals(content, response.getContent());
    }

    @Test
    void setAndGetErrors() {
        ApiResponse<String> response = new ApiResponse<>();
        ApiError error1 = new ApiError("E001", "First error");
        ApiError error2 = new ApiError("E002", "Second error");
        List<ApiError> errors = Arrays.asList(error1, error2);

        response.setErrors(errors);
        List<ApiError> retrievedErrors = response.getErrors();

        assertEquals(2, retrievedErrors.size());
        assertTrue(retrievedErrors.contains(error1));
        assertTrue(retrievedErrors.contains(error2));
    }

    @Test
    void responseWithoutErrors() {
        ApiResponse<String> response = new ApiResponse<>("No errors");
        assertTrue(response.getErrors().isEmpty());
    }
}

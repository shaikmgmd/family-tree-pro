package api.common;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ApiResponseErrorTest {

    @Test
    void createApiResponseError_withApiResponse() {
        ApiResponse<String> apiResponse = new ApiResponse<>("Test Content");
        ApiResponseError responseError = new ApiResponseError(apiResponse);

        assertEquals(apiResponse, responseError.getResponse());
        assertNull(responseError.getApiError());
    }

    @Test
    void createApiResponseError_withApiError() {
        ApiError apiError = new ApiError("E001", "Error occurred");
        apiError.addDetail("Detailed message");
        ApiResponseError responseError = new ApiResponseError(apiError);

        assertEquals(apiError, responseError.getApiError());
        assertNull(responseError.getResponse());
        assertEquals("Detailed message", responseError.getMessage());
    }

    @Test
    void setAndGetApiResponse() {
        ApiResponse<String> apiResponse = new ApiResponse<>("Initial Content");
        ApiResponseError responseError = new ApiResponseError(apiResponse);

        ApiResponse<String> newApiResponse = new ApiResponse<>("New Content");
        responseError.setResponse(newApiResponse);

        assertEquals(newApiResponse, responseError.getResponse());
    }

    @Test
    void setAndGetApiError() {
        ApiError initialApiError = new ApiError("E001", "Initial error");
        ApiResponseError responseError = new ApiResponseError(initialApiError);

        ApiError newApiError = new ApiError("E002", "New error");
        responseError.setApiError(newApiError);

        assertEquals(newApiError, responseError.getApiError());
    }
}

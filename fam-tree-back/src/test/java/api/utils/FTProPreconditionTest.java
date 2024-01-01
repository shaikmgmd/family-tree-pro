package api.utils;

import api.common.ApiError;
import api.common.ApiResponse;
import api.common.ApiResponseError;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FTProPreconditionTest {

    private ApiResponse response;
    private ApiError error;

    @BeforeEach
    public void setUp() {
        response = new ApiResponse();
        error = new ApiError("error_code", "error_message");
    }

    @Test
    public void testThrowErrorOnCheckArgument_withConditionTrue() {
        FTProPrecondition.throwErrorOnCheckArgument(response, true, error);
        assertTrue(response.getErrors().isEmpty());
    }

    @Test
    public void testCheckArgument_addsErrorOnFalseCondition() {
        FTProPrecondition.checkArgument(response, false, error);
        assertTrue(response.getErrors().contains(error));
    }

    @Test
    public void testCheckArgument_doesNotAddErrorOnTrueCondition() {
        FTProPrecondition.checkArgument(response, true, error);
        assertTrue(response.getErrors().isEmpty());
    }

    @Test
    public void testContinueIfNoError_throwsExceptionOnError() {
        response.getErrors().add(error);
        assertThrows(ApiResponseError.class, () -> FTProPrecondition.continueIfNoError(response));
    }

    @Test
    public void testContinueIfNoError_doesNotThrowExceptionWhenNoError() {
        assertDoesNotThrow(() -> FTProPrecondition.continueIfNoError(response));
    }
}

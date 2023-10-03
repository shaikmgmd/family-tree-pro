package api.utils;

import api.common.ApiError;
import api.common.ApiResponse;
import api.common.ApiResponseError;

public class FTProPrecondition {

    public static void throwErrorOnCheckArgument(ApiResponse response, boolean condition, ApiError error) {
        checkArgument(response, condition, error);
        continueIfNoError(response);
    }

    public static void checkArgument(ApiResponse response, boolean condition, ApiError error) {
        if (!condition && !response.getErrors().contains(error)) {
            response.getErrors().add(error);
        }
    }

    public static void continueIfNoError(ApiResponse response) {
        if (response.getErrors().size() > 0) {
            throw new ApiResponseError(response);
        }
    }
}
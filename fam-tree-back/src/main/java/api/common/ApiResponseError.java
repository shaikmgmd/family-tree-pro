package api.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"stackTrace", "cause", "suppressed", "localizedMessage"})
public class ApiResponseError extends RuntimeException{

    private ApiResponse apiResponse;

    private ApiError apiError;

    public ApiResponseError(ApiResponse response) {
        super();
        this.apiResponse = response;
    }

    public ApiResponseError(ApiError error) {
        super(error.getDetail());
        this.apiError = error;
    }

    public ApiResponse getResponse() {
        return apiResponse;
    }

    public void setResponse(ApiResponse response) {
        this.apiResponse = response;
    }

    public ApiError getApiError() {
        return apiError;
    }

    public void setApiError(ApiError apiError) {
        this.apiError = apiError;
    }
}

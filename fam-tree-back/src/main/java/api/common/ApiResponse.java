package api.common;

import java.util.ArrayList;
import java.util.List;

public class ApiResponse<T> {

    private T content;

    private List<ApiError> errors = new ArrayList<>();

    public ApiResponse() {
    }

    public ApiResponse(T content) {
        this.content = content;
    }
    public static <O> ApiResponse<O> from(O content) {
        return new ApiResponse<>(content);
    }

    public T getContent() {
        return content;
    }

    public void setContent(T content) {
        this.content = content;
    }

    public List<ApiError> getErrors() {
        return errors;
    }

    public void setErrors(List<ApiError> errors) {
        this.errors = errors;
    }
}

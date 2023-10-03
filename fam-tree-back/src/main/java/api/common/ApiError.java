package api.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.http.HttpStatus;

@JsonIgnoreProperties({"stackTrace", "cause", "suppressed", "localizedMessage"})
public class ApiError extends RuntimeException {

    public static final ApiError AUTHENTICATION_FAILED = new ApiError("A0001", "Erreur d'authentification");

    private String code;
    private String message;
    private String detail;

    public ApiError() {
    }

    public ApiError(final String code, final String message) {
        this.code = code;
        this.message = message;
    }

    public ApiError addDetail(String detail) {
        this.setDetail(detail);
        return this;
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(final String message) {
        this.message = message;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(final String detail) {
        this.detail = detail;
    }

}

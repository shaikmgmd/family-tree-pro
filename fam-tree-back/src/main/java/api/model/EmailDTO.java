package api.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EmailDTO {
    @JsonProperty("email")
    private String email;

    // Standard getters and setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

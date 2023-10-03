package api.model.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateRequest {
    private String privateCode;
    private String newPassword;
}

package api.model.auth.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginReq {
    private String privateCode;
    private String password;

    public LoginReq(String privateCode, String password) {
        this.privateCode = privateCode;
        this.password = password;
    }
}

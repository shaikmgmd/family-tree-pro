package api.model.auth.response;

import api.model.user.User;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class LoginRes {
    private String privateCode;
    private String token;
    private List<String> roles;

    public LoginRes(String privateCode, String token, List<String> roles) {
        this.privateCode = privateCode;
        this.token = token;
        this.roles = roles;
    }
}
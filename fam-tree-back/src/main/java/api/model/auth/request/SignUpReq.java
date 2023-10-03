package api.model.auth.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpReq {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
}


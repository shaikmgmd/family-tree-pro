package api.model.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdate {
    private String phone;
    private String address;
    private String email;
}

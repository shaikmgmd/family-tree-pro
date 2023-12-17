package api.model.user;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class UserUpdate {
    private String phone;
    private String address;
    private String email;

    public UserUpdate(String phone, String address, String email) {
        this.phone = phone;
        this.address = address;
        this.email = email;
    }
}

package api.model.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdate {
    private String phone;
    private String address;
    private String email;

    public UserUpdate(String phone, String address, String email) {
        this.phone = phone;
        this.address = address;
        this.email = email;
    }

    @Override
    public String toString() {
        return "UserUpdate{" +
                "phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}

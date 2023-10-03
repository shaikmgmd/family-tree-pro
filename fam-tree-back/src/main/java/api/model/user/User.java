package api.model.user;

import api.model.BaseEntityWithAudit;
import api.model.role.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "ftpro_user")
public class User extends BaseEntityWithAudit {
    private String socialSecurityNumber;
    private String lastName;
    private String firstName;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd MMM yyyy")
    private Date birthDate;
    private String nationality;
    private String idCardPath;
    private String photoPath;
    private String publicCode;
    @Column(unique = true)
    private String privateCode;
    private String phone;
    private String address;
    @Column(unique = true)
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    private boolean firstLogin = true;

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public User(String lastName, String firstName, Date birthDate, String nationality,
                String publicCode, String privateCode,
                String socialSecurityNumber, String idCardPath, String photoPath,
                String email, String password) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.birthDate = birthDate;
        this.nationality = nationality;
        this.publicCode = publicCode;
        this.privateCode = privateCode;
        this.socialSecurityNumber = socialSecurityNumber;
        this.idCardPath = idCardPath;
        this.photoPath = photoPath;
        this.email = email;
        this.password = password;
    }
}

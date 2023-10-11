package api.model.adhesion;

import api.model.BaseEntityWithAudit;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name="adhesion_request")
public class AdhesionRequest extends BaseEntityWithAudit {
    private String socialSecurityNumber;
    private String lastName;
    private String firstName;
    private LocalDate birthDate;
    private String nationality;
    private String idCardPath;
    private String photoPath;
    private String email;
    @Enumerated(EnumType.STRING)
    private AdhesionStatus status = AdhesionStatus.PENDING;

    @Override
    public String toString() {
        return "AdhesionRequest{" +
                "socialSecurityNumber='" + socialSecurityNumber + '\'' +
                ", lastName='" + lastName + '\'' +
                ", firstName='" + firstName + '\'' +
                ", birthDate=" + birthDate +
                ", nationality='" + nationality + '\'' +
                ", idCardPath='" + idCardPath + '\'' +
                ", photoPath='" + photoPath + '\'' +
                ", email='" + email + '\'' +
                ", status=" + status +
                ", id=" + id +
                ", version=" + version +
                '}';
    }
}



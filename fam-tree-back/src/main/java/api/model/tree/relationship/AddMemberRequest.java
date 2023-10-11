package api.model.tree.relationship;

import api.model.tree.FamilyMember;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AddMemberRequest {
    private String name;
    private LocalDate birthDate;

    private String email;
    private String socialSecurityNumber; // Non obligatoire
    private String address; // Non obligatoire
    private String phoneNumber; // Non obligatoire

    private FamilyMember sourceMember;
    private FamilyMember targetMember;
    private RelationshipType type;

    @Override
    public String toString() {
        return "AddMemberRequest{" +
                "name='" + name + '\'' +
                ", birthDate=" + birthDate +
                ", email='" + email + '\'' +
                ", socialSecurityNumber='" + socialSecurityNumber + '\'' +
                ", address='" + address + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", sourceMember=" + sourceMember +
                ", targetMember=" + targetMember +
                ", type=" + type +
                '}';
    }
}
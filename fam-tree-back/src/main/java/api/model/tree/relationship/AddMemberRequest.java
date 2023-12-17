package api.model.tree.relationship;

import api.model.tree.FamilyMember;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

@Getter
@Setter
@ToString
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

}
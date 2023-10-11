package api.model.tree.relationship;

import api.model.tree.FamilyMember;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "relationship_confirmation")
public class RelationshipConfirmation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "confirmation_code", nullable = false, unique = true)
    private String confirmationCode;

    @ManyToOne
    @JoinColumn(name = "source_member_id")
    private FamilyMember sourceMember;

    @ManyToOne
    @JoinColumn(name = "target_member_id")
    private FamilyMember targetMember;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type")
    private RelationshipType relationshipType;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "is_confirmed")
    private Boolean isConfirmed = false;  // Par défaut, il est mis à false. Il sera mis à true lorsque la personne confirmera le lien.

    @Column(name = "is_processed")
    private Boolean isProcessed = false;  // Indique si cette demande a été traitée ou non.

    @Override
    public String toString() {
        return "RelationshipConfirmation{" +
                "id=" + id +
                ", confirmationCode='" + confirmationCode + '\'' +
                ", sourceMember=" + sourceMember +
                ", targetMember=" + targetMember +
                ", relationshipType=" + relationshipType +
                ", expiryDate=" + expiryDate +
                ", isConfirmed=" + isConfirmed +
                ", isProcessed=" + isProcessed +
                '}';
    }
}

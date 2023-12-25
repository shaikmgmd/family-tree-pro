package api.model.tree.relationship;

import api.model.tree.FamilyMember;
import api.model.tree.Personne;
import api.model.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Table(name = "relationship_confirmation")
public class RelationshipConfirmation {
//
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "confirmation_code", nullable = false, unique = true)
    private String confirmationCode;

    @ManyToOne
    @JoinColumn(name = "source_member_id")
    private User sourceMember;

    @ManyToOne
    @JoinColumn(name = "target_member_id")
    private User targetMember;

//    @Enumerated(EnumType.STRING)
//    @Column(name = "relationship_type")
//    private RelationshipType relationshipType;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Column(name = "is_confirmed")
    private Boolean isConfirmed = false;  // Par défaut, il est mis à false. Il sera mis à true lorsque la personne confirmera le lien.

    @Column(name = "is_processed")
    private Boolean isProcessed = false;  // Indique si cette demande a été traitée ou non.

}

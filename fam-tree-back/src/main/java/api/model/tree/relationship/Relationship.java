package api.model.tree.relationship;

import api.model.BaseEntityWithAudit;
import api.model.tree.FamilyMember;
import api.model.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

//
@Entity
@Getter
@Setter
@Table(name = "relationship")
public class Relationship extends BaseEntityWithAudit {
    @ManyToOne
    @JoinColumn(name = "source_member_id")
    @JsonIgnore
    private FamilyMember sourceMember; // e.g., "John" (Parent)

    @ManyToOne
    @JoinColumn(name = "target_member_id")
    @JsonIgnore
    private FamilyMember targetMember; // e.g., "Anne" (Child)

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship_type")
    private RelationshipType type;  // Enum defining the type of the relationship (PARENT, CHILD, SIBLING, etc.)
}




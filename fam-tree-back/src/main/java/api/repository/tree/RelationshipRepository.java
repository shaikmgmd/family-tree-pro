package api.repository.tree;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RelationshipRepository extends JpaRepository<Relationship, Long> {
    List<Relationship> findBySourceMemberAndType(FamilyMember sourceMember, RelationshipType type);

    boolean existsBySourceMemberAndTargetMemberAndType(FamilyMember sourceMember, FamilyMember targetMember, RelationshipType type);

    List<Relationship> findBySourceMember(FamilyMember sourceMember);

    List<Relationship> findByTargetMemberAndType(FamilyMember member, RelationshipType relationshipType);

    List<Relationship> findByTargetMember(FamilyMember member);

    List<Relationship> findByTargetMemberAndTypeIn(FamilyMember targetMember, List<RelationshipType> types);

}

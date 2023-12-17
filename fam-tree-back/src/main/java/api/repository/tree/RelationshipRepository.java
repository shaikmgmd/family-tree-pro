package api.repository.tree;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RelationshipRepository extends JpaRepository<Relationship, Long> {
    List<Relationship> findBySourceMemberAndType(FamilyMember sourceMember, RelationshipType type);

    boolean existsBySourceMemberAndTargetMemberAndType(FamilyMember sourceMember, FamilyMember targetMember, RelationshipType type);
    
    List<Relationship> findBySourceMember(FamilyMember sourceMember);
    @Query("SELECT r1.sourceMember FROM Relationship r1, Relationship r2 " +
            "WHERE r1.targetMember.id = :memberId1 AND r2.targetMember.id = :memberId2 " +
            "AND r1.sourceMember = r2.sourceMember AND r1.type = 'PARENT' AND r2.type = 'PARENT'")
    List<FamilyMember> findCommonParents(@Param("memberId1") Long memberId1, @Param("memberId2") Long memberId2);

    List<Relationship> findByTargetMemberAndType(FamilyMember member, RelationshipType relationshipType);

    List<Relationship> findByTargetMember(FamilyMember member);

    List<Relationship> findByTargetMemberAndTypeIn(FamilyMember targetMember, List<RelationshipType> types);

}

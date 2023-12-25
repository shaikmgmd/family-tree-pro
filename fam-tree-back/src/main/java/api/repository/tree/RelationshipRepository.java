package api.repository.tree;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
//
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

    // Méthodes pour récupérer des relations basées sur différents rôles
    @Query("SELECT r FROM Relationship r WHERE r.sourceMember.id = :personId")
    List<Relationship> findByPerson_Id(@Param("personId") Long personId);

    @Query("SELECT r FROM Relationship r WHERE r.targetMember.id = :motherId")
    List<Relationship> findByMother_Id(@Param("motherId") Long motherId);

    @Query("SELECT r FROM Relationship r WHERE r.targetMember.id = :partnerId")
    List<Relationship> findByPartner_Id(@Param("partnerId") Long partnerId);


    // Ajouter les méthodes pour supprimer les relations
    @Modifying
    @Transactional
    @Query("DELETE FROM Relationship r WHERE r.sourceMember.id = :memberId")
    void deleteBySourceMemberId(@Param("memberId") Long memberId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Relationship r WHERE r.targetMember.id = :memberId")
    void deleteByTargetMemberId(@Param("memberId") Long memberId);

}

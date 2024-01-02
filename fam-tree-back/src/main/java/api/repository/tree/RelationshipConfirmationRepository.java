package api.repository.tree;

import api.model.tree.RelationshipConfirmation;
import api.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface RelationshipConfirmationRepository extends JpaRepository<RelationshipConfirmation, Long> {
    Optional<RelationshipConfirmation> findByConfirmationCode(String confirmationCode);

    Optional<RelationshipConfirmation> findBySourceMemberAndTargetMember(User sourceMember, User TargetMember);

    void deleteBySourceMemberAndTargetMember(User sourceMember, User targetMember);
}


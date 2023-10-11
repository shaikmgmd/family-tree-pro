package api.repository.tree;

import api.model.tree.relationship.RelationshipConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RelationshipConfirmationRepository extends JpaRepository<RelationshipConfirmation, Long> {
    Optional<RelationshipConfirmation> findByConfirmationCode(String confirmationCode);
}


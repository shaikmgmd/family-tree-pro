package api.service.relationship;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import api.repository.tree.RelationshipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;  // Supposons que cela existe pour gérer les relations dans votre base de données

    // ... autres dépendances ...

    public boolean isValidRelationship(FamilyMember source, FamilyMember target, RelationshipType type) {
        // Si le type est PARENT
        if (type == RelationshipType.PARENT) {
            return isValidParentRelationship(source, target);
        }

        // Si le type est CHILD
        if (type == RelationshipType.CHILD) {
            return isValidChildRelationship(source, target);
        }

        // Si le type est SIBLING ( Frr / Soeur )
        if (type == RelationshipType.SIBLING) {
            return isValidSiblingRelationship(source, target);
        }

        return false;  // Retourner faux pour d'autres types ou si aucune vérification n'est définie pour ce type
    }

    private boolean isValidParentRelationship(FamilyMember source, FamilyMember target) {
        // Un parent ne peut pas être un enfant ou un frère/soeur du target
        if (source.getBirthDate().isAfter(target.getBirthDate())) {
            return false;
        }

        List<Relationship> conflictingRelations = relationshipRepository.findBySourceMemberAndType(target, RelationshipType.PARENT);
        conflictingRelations.addAll(relationshipRepository.findBySourceMemberAndType(target, RelationshipType.SIBLING));

        for (Relationship rel : conflictingRelations) {
            if (rel.getTargetMember().equals(source)) {
                return false;
            }
        }

        return true;
    }

    private boolean isValidChildRelationship(FamilyMember source, FamilyMember target) {
        if (source.getBirthDate().isBefore(target.getBirthDate())) {
            return false;
        }
        return isValidParentRelationship(target, source);
    }

    private boolean isValidSiblingRelationship(FamilyMember source, FamilyMember target) {
        // Vérifier si l'un des membres est un parent de l'autre
        if (relationshipRepository.existsBySourceMemberAndTargetMemberAndType(source, target, RelationshipType.PARENT) ||
                relationshipRepository.existsBySourceMemberAndTargetMemberAndType(target, source, RelationshipType.PARENT)) {
            return false;
        }

        return true;
    }


}


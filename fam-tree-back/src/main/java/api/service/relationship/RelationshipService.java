package api.service.relationship;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.RelationshipRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RelationshipService {

    private final RelationshipRepository relationshipRepository;
    private final FamilyMemberRepository familyMemberRepository;

    public void addRelationship(Long sourceMemberId, Long targetMemberId, RelationshipType type) {
        FamilyMember sourceMember = familyMemberRepository.findById(sourceMemberId)
                .orElseThrow(() -> new EntityNotFoundException("Membre source non trouvé avec ID " + sourceMemberId));
        FamilyMember targetMember = familyMemberRepository.findById(targetMemberId)
                .orElseThrow(() -> new EntityNotFoundException("Membre cible non trouvé avec ID " + targetMemberId));

        if (!isValidRelationship(sourceMember, targetMember, type)) {
            throw new IllegalArgumentException("Relation invalide entre les membres fournis");
        }

        Relationship relationship = new Relationship();
        relationship.setSourceMember(sourceMember);
        relationship.setTargetMember(targetMember);
        relationship.setType(type);

        relationshipRepository.save(relationship);
    }

    public boolean isValidRelationship(FamilyMember source, FamilyMember target, RelationshipType type) {
        switch (type) {
            case PARENT:
                return isValidParentChildRelationship(source, target);
            case CHILD:
                return isValidParentChildRelationship(target, source);
            case SIBLING:
                return isValidSiblingRelationship(source, target);
            // Ajouter d'autres cas si nécessaire
            default:
                return false;
        }
    }

    public boolean isValidParentChildRelationship(FamilyMember parent, FamilyMember child) {
        return parent.getBirthDate().isBefore(child.getBirthDate());
    }

    public boolean isValidSiblingRelationship(FamilyMember sibling1, FamilyMember sibling2) {
        // Vérifie si les deux membres ont au moins un parent en commun
        return relationshipRepository.findCommonParents(sibling1.getId(), sibling2.getId()).size() > 0;
    }
}


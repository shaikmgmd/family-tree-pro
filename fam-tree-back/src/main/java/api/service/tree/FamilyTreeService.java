package api.service.tree;

import api.exception.UserNotFoundException;
import api.model.tree.*;
import api.model.tree.relationship.AddMemberRequest;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipType;
import api.model.user.User;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.RelationshipRepository;
import api.repository.user.UserRepository;
import api.service.relationship.RelationshipConfirmationService;
import api.service.relationship.RelationshipService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FamilyTreeService {

    private final FamilyTreeRepository familyTreeRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final RelationshipRepository relationshipRepository;
    private final PersonneService personneService;
    private final UserRepository userRepository;

    public List<Map<String, Object>> getFamilyTreeByUserId(Long userId) {
        Optional<FamilyTree> optTree = familyTreeRepository.findByUserId(userId);

        // Vérifier si l'Optional contient une valeur avant de l'utiliser
        if (optTree.isPresent()) {
            FamilyTree tree = optTree.get();
            List<Map<String, Object>> lp = personneService.findByTreeId(tree.getId());
            return lp;
        } else {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + userId);
        }
    }

    private TreeNode buildTree(FamilyMember rootMember) {
        TreeNode rootNode = new TreeNode(rootMember);
        List<Relationship> childRelationships = relationshipRepository.findBySourceMember(rootMember);
        for (Relationship relationship : childRelationships) {
            TreeNode childNode = buildTree(relationship.getTargetMember());
            rootNode.addChild(childNode);
        }
        return rootNode;
    }

    public void addMemberToTree(Long userId, Long sourceMemberId, AddMemberRequest request) {
        FamilyMember sourceMember = familyMemberRepository.findById(sourceMemberId)
                .orElseThrow(() -> new EntityNotFoundException("Membre source non trouvé avec ID " + sourceMemberId));
        FamilyMember newMember = new FamilyMember();
        newMember.setName(request.getName());
        newMember.setBirthDate(request.getBirthDate());

        // Mettre à jour les autres champs de newMember ici

        // Sauvegarder le nouveau membre
        newMember = familyMemberRepository.save(newMember);

        // Créer une relation
        Relationship relationship = new Relationship();
        relationship.setSourceMember(sourceMember);
        relationship.setTargetMember(newMember);
        relationship.setType(request.getType());

        // Sauvegarder la relation
        relationshipRepository.save(relationship);
    }

    public FamilyMember updateMemberToTree(Long memberId, AddMemberRequest updateRequest) {
        // Trouver le membre existant par son ID
        FamilyMember existingMember = familyMemberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("Membre non trouvé avec ID " + memberId));

        // Mettre à jour les informations du membre
        if (updateRequest.getName() != null) {
            existingMember.setName(updateRequest.getName());
        }
        if (updateRequest.getBirthDate() != null) {
            existingMember.setBirthDate(updateRequest.getBirthDate());
        }

        return familyMemberRepository.save(existingMember);
    }

    public void deleteMemberToTree(Long memberId) {
        if (!familyMemberRepository.existsById(memberId)) {
            throw new EntityNotFoundException("Membre non trouvé avec ID " + memberId);
        }

        // Supprimer toutes les relations associées au membre
        deleteAllRelationsForMember(memberId);

        // Supprimer le membre
        familyMemberRepository.deleteById(memberId);
    }

    private void deleteAllRelationsForMember(Long memberId) {
        // Supprimer les relations où le membre est le sourceMember ou le targetMember
        relationshipRepository.deleteBySourceMemberId(memberId);
        relationshipRepository.deleteByTargetMemberId(memberId);
    }

    public void deleteRelatedRelations(Long memberId) {
        // Trouver et supprimer les relations où le membre est impliqué
        Optional<List<Relationship>> personRelationsOptional = Optional.ofNullable(relationshipRepository.findByPerson_Id(memberId));
        Optional<List<Relationship>> motherRelationsOptional = Optional.ofNullable(relationshipRepository.findByMother_Id(memberId));
        Optional<List<Relationship>> partnerRelationsOptional = Optional.ofNullable(relationshipRepository.findByPartner_Id(memberId));

        // Supprimer toutes les relations trouvées
        personRelationsOptional.ifPresent(relationshipRepository::deleteAll);
        motherRelationsOptional.ifPresent(relationshipRepository::deleteAll);
        partnerRelationsOptional.ifPresent(relationshipRepository::deleteAll);
    }




}

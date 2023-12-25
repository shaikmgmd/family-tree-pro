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
//import api.service.relationship.RelationshipConfirmationService;
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
    private final UserRepository userRepository; // Assumé qu'il existe pour gérer les utilisateurs

    public List<Map<String, Object>> getFamilyTreeByUserId(Long userId) {
        Optional<FamilyTree> optTree = familyTreeRepository.findByUserId(userId);
        FamilyTree tree = optTree.get();
        if (tree == null) {
            throw new EntityNotFoundException("Arbre généalogique non trouvé pour l'utilisateur avec ID " + userId);
        }
        List<Map<String, Object>> lp = personneService.findByTreeId(tree.getId());
        return lp; // Assumé qu'il y a une méthode getRootMember() dans FamilyTree
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
}

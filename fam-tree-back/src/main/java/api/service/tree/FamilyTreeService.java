package api.service.tree;

import api.exception.UserNotFoundException;
import api.model.tree.FamilyMember;
import api.model.tree.FamilyTree;
import api.model.tree.TreeNode;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class FamilyTreeService {

    private final FamilyTreeRepository familyTreeRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final RelationshipRepository relationshipRepository;
    private final UserRepository userRepository;
    private final RelationshipService relationshipService;
    private final RelationshipConfirmationService relationshipConfirmationService;


    public void addMemberToTree(Long userId, Long sourceMemberId, AddMemberRequest request) {
        System.out.println("TYPE => "+request.getType());
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        FamilyTree tree = familyTreeRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Tree not found"));
        FamilyMember sourceMember;
        if (sourceMemberId == null) {
            sourceMember = familyMemberRepository.findByUserId(userId)
                    .orElseThrow(() -> new UserNotFoundException("Source user not found"));
        } else {
            sourceMember = familyMemberRepository.findById(sourceMemberId)
                    .orElseThrow(() -> new UserNotFoundException("Source member not found"));
        }


        Optional<User> existingUserWithEmail = userRepository.findByEmail(request.getEmail());
        if (existingUserWithEmail.isPresent()) {
            // L'utilisateur existe, envoyons une demande de confirmation
            relationshipConfirmationService.requestRelationshipConfirmation(existingUserWithEmail.get().getEmail(), sourceMember, request.getType());
            return;  // Terminer ici car nous devons attendre la confirmation
        }

        /*if (hasInverseRelationship(sourceMember, targetMember, request.getType())) {
            throw new RuntimeException("Inverse relationship already exists!");
        }*/

        // Si l'utilisateur n'existe pas, créez un nouveau membre et ajoutez-le à l'arbre directement
        FamilyMember targetMember = new FamilyMember();
        targetMember.setName(request.getName());
        targetMember.setBirthDate(request.getBirthDate());
        targetMember.setUser(null);  // Cette personne n'est pas un utilisateur enregistré
        familyMemberRepository.save(targetMember);

        addMemberDirectlyToTree(tree, sourceMember, targetMember, request.getType());
    }

    private void addMemberDirectlyToTree(FamilyTree tree, FamilyMember sourceMember, FamilyMember targetMember, RelationshipType relationshipType) {
        // Ajouter le membre à l'arbre
        targetMember.setTree(tree);
        familyMemberRepository.save(targetMember);

        // Maintenant, dépendant de la demande, nous devons créer une relation
        Relationship relationship = new Relationship();
        switch (relationshipType) {
            case PARENT:
                relationship.setSourceMember(targetMember); // Inverser les rôles
                relationship.setTargetMember(sourceMember);
                relationship.setType(RelationshipType.CHILD);
                break;
            default:
                relationship.setSourceMember(sourceMember);
                relationship.setTargetMember(targetMember);
                relationship.setType(relationshipType);
                break;
        }
        relationshipRepository.save(relationship);
    }


    public void addExistingMemberToTree(FamilyTree tree, FamilyMember sourceMember, FamilyMember targetMember, RelationshipType relationshipType) {
        System.out.println("TREE USER \n\n");
        System.out.println(tree.getUser());
        FamilyMember treeOwner = familyMemberRepository.findByUserId(tree.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Tree owner not found"));

        // Ajouter le membre existant à l'arbre
        targetMember.setTree(tree);
        familyMemberRepository.save(targetMember);

        // Maintenant, dépendant de la demande, nous devons créer une relation
        Relationship relationship = new Relationship();
        relationship.setSourceMember(sourceMember);
        relationship.setTargetMember(targetMember);
        relationship.setType(relationshipType);

        // Valider la relation
        /*if (!relationshipService.isValidRelationship(treeOwner, targetMember, relationshipType)) {
            throw new RuntimeException("Invalid relationship");
        }*/

        relationshipRepository.save(relationship);
    }

    public TreeNode getFamilyTreeByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));
        System.out.println(user);
        FamilyMember rootMember = familyMemberRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Family member not found"));
        System.out.println(rootMember);
        TreeNode rootNode = new TreeNode(rootMember);
        populateChildNodes(rootNode, new HashSet<>());

        System.out.println(rootNode);
        return rootNode;
    }

    private void populateChildNodes(TreeNode parentNode, Set<Long> processedMembers) {
        if (processedMembers.contains(parentNode.getMember().getId())) {
            return; // Ce membre a déjà été traité
        }
        processedMembers.add(parentNode.getMember().getId());

        List<Relationship> relationships = relationshipRepository.findBySourceMember(parentNode.getMember());
        for (Relationship relationship : relationships) {
            TreeNode childNode = new TreeNode(relationship.getTargetMember());
            parentNode.addChild(childNode);
            populateChildNodes(childNode, processedMembers);  // Récursion pour parcourir les descendants du membre actuel
        }
    }
}

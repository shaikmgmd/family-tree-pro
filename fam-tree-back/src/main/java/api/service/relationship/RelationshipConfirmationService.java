package api.service.relationship;

import api.model.tree.FamilyMember;
import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.relationship.AddMemberRequest;
import api.model.tree.relationship.Relationship;
import api.model.tree.relationship.RelationshipConfirmation;
import api.model.tree.relationship.RelationshipType;
import api.model.user.User;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationshipConfirmationRepository;
import api.repository.tree.RelationshipRepository;
import api.repository.user.UserRepository;
import api.service.mail.MailService;
import api.service.tree.FamilyTreeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RelationshipConfirmationService {

    private final UserRepository userRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final MailService emailService;
    private final RelationshipConfirmationRepository relationshipConfirmationRepository;
    private final PersonneRepository personneRepository;


//    public void requestRelationshipConfirmation(String emailOfMemberToAdd, FamilyMember sourceMember, RelationshipType relationshipType) {
//        Optional<User> existingUser = userRepository.findByEmail(emailOfMemberToAdd);
//        if (existingUser.isEmpty()) {
//            throw new RuntimeException("User not found");
//        }
//
//        FamilyMember targetMember = familyMemberRepository.findByUserId(existingUser.get().getId())
//                .orElseGet(() -> {
//                    FamilyMember newFamilyMember = new FamilyMember();
//                    newFamilyMember.setUser(existingUser.get());
//                    newFamilyMember.setName(existingUser.get().getFirstName()); // Assuming the User entity has a name attribute
//                    newFamilyMember.setBirthDate(existingUser.get().getBirthDate()); // You might want to handle this differently if the User entity has a birthdate attribute
//                    return familyMemberRepository.save(newFamilyMember);
//                });
//
//        String confirmationCode = UUID.randomUUID().toString();
//
//        RelationshipConfirmation confirmation = new RelationshipConfirmation();
//        confirmation.setConfirmationCode(confirmationCode);
//        confirmation.setSourceMember(sourceMember);
//        confirmation.setTargetMember(targetMember);
//        confirmation.setRelationshipType(relationshipType);
//        confirmation.setExpiryDate(LocalDateTime.now().plusDays(7));
//
//        confirmationRepository.save(confirmation);
//
//        emailService.sendRelationshipConfirmationEmail(sourceMember, existingUser.get().getEmail(), confirmationCode);
//    }


    public void requestRelationshipConfirmation(Long userId, String emailOfMemberToAdd) {

        Optional<User> targetMember = userRepository.findByEmail(emailOfMemberToAdd);
        Optional<User> sourceMember = userRepository.findById(userId);

        if (targetMember.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        System.out.println("TARGET =>" + targetMember.get().getEmail());
        System.out.println("SOURCE =>" + sourceMember.get().getEmail());


        String confirmationCode = UUID.randomUUID().toString();

        RelationshipConfirmation confirmation = new RelationshipConfirmation();

        Optional<RelationshipConfirmation> existingTargetMember = relationshipConfirmationRepository.findByTargetMember(targetMember.get());

        if(existingTargetMember.isPresent()) {
            throw new RuntimeException("User already add");
        }

        confirmation.setConfirmationCode(confirmationCode);
        confirmation.setSourceMember(sourceMember.get());
        confirmation.setTargetMember(targetMember.get());
        confirmation.setExpiryDate(LocalDateTime.now().plusDays(7));
        confirmation.setIsConfirmed(false);
        relationshipConfirmationRepository.save(confirmation);

        Optional<Personne> personne = personneRepository.findByEmail(emailOfMemberToAdd);
        personne.get().setName("En attente");
        personneRepository.save(personne.get());

        emailService.sendRelationshipConfirmationEmail(emailOfMemberToAdd, confirmationCode);

    }

    public String confirmRelationship(String confirmationCode) {
        RelationshipConfirmation confirmation = retrieveConfirmation(confirmationCode);
//        System.out.println("CONFIRMATION CODE =>" + confirmation.getConfirmationCode());

        boolean isProcessed = confirmation.getIsProcessed();
        if(isProcessed) {
            return "Confirmation déjà traité";
        }
        /*if (confirmation.getIsConfirmed()) {*/
            handleConfirmedRelationship(confirmation);
        /*} else {
            handleDeniedRelationship(confirmation);
        }*/

        markConfirmationAsProcessed(confirmation);

        return "Confirmation validé";
//        return "Confirmation pour le code " + confirmationCode + " validée";

    }

    private RelationshipConfirmation retrieveConfirmation(String confirmationCode) {
        RelationshipConfirmation confirmation = relationshipConfirmationRepository.findByConfirmationCode(confirmationCode)
                .orElseThrow(() -> new RuntimeException("Invalid or expired confirmation code"));

        if (LocalDateTime.now().isAfter(confirmation.getExpiryDate())) {
            throw new RuntimeException("Confirmation code has expired.");
        }

//        if (confirmation.getIsProcessed()) {
//            throw new RuntimeException("This request has already been processed.");
//        }

        return confirmation;
    }

//    private void handleConfirmedRelationship(RelationshipConfirmation confirmation) {
//        FamilyTree sourceTree = confirmation.getSourceMember().getTree();
//
//        FamilyMember targetMember = familyMemberRepository.findById(confirmation.getTargetMember().getId())
//                .orElseThrow(() -> new RuntimeException("Family member not found for id"));
//
//        targetMember.setTree(sourceTree);
//        familyMemberRepository.save(targetMember);
//
//        // Créer une relation
//        Relationship relationship = new Relationship();
//        relationship.setSourceMember(confirmation.getSourceMember());
//        relationship.setTargetMember(targetMember);
//        relationship.setType(RelationshipType.PARENT);
//
//        relationshipRepository.save(relationship);
//
//        // TODO: Ajouter d'autres logiques ou notifications si nécessaire
//        confirmation.setIsConfirmed(true);
//        confirmationRepository.save(confirmation);
//    }

    private void handleConfirmedRelationship(RelationshipConfirmation confirmation) {
        // Retrouver le fto_user grace a target dans relaction_ship_confirmation
        Optional<User> user = userRepository.findById(confirmation.getTargetMember().getId());

        if(user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Date date = Date.from(user.get().getBirthDate().atStartOfDay(ZoneId.systemDefault()).toInstant());

        // Si oui changer dans la bdd les infos de personne par ftp_pro_user
        Optional<Personne> personne = personneRepository.findByEmail(user.get().getEmail());
        personne.get().setName(user.get().getFirstName() + " " + user.get().getLastName());
        personne.get().setBorn(date);
        personne.get().setPhoto(user.get().getPhotoPath());
        personne.get().setPhone(user.get().getPhone());
        personne.get().setCity(user.get().getCity());
        personne.get().setCountry(user.get().getNationality());
        personne.get().setAddress(user.get().getAddress());
//        personne.get().setGender(user.get().getGender());
        personne.get().setIs_registered(true);
        personneRepository.save(personne.get());

    }

    private void handleDeniedRelationship(RelationshipConfirmation confirmation) {
        // Si refusé, gérer les actions appropriées, comme envoyer une notification
        // TODO: Implémenter la logique ici
        // Pas besoin de mettre à jour la confirmation puisqu'elle est déjà définie comme refusée
    }

    private void markConfirmationAsProcessed(RelationshipConfirmation confirmation) {
        confirmation.setIsProcessed(true);
        relationshipConfirmationRepository.save(confirmation);
    }



}


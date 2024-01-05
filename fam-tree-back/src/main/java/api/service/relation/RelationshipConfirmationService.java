package api.service.relation;

import api.model.tree.Personne;
import api.model.tree.Relation;
import api.model.tree.RelationshipConfirmation;
import api.model.user.User;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationRepository;
import api.repository.tree.RelationshipConfirmationRepository;
import api.repository.user.UserRepository;
import api.service.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class RelationshipConfirmationService {

    private final UserRepository userRepository;
    private final MailService emailService;
    private final RelationshipConfirmationRepository relationshipConfirmationRepository;
    private final PersonneRepository personneRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final RelationRepository relationRepository;


    public void requestRelationshipConfirmation(String emailOfMemberToAdd, Long nodeId) {
        String currentPrivateCode = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currUser = userRepository.findByPrivateCode(currentPrivateCode);

        Optional<User> targetMember = userRepository.findByEmail(emailOfMemberToAdd);
        User sourceMember = currUser;

        if (targetMember.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        String confirmationCode = UUID.randomUUID().toString();

        RelationshipConfirmation confirmation = new RelationshipConfirmation();

        Optional<RelationshipConfirmation> existingTargetMember = relationshipConfirmationRepository.findBySourceMemberAndTargetMember(sourceMember, targetMember.get());

        if (existingTargetMember.isPresent()) {
            throw new RuntimeException("User already add");
        }

        confirmation.setConfirmationCode(confirmationCode);
        confirmation.setSourceMember(sourceMember);
        confirmation.setTargetMember(targetMember.get());
        confirmation.setExpiryDate(LocalDateTime.now().plusDays(7));
        confirmation.setIsConfirmed(false);
        relationshipConfirmationRepository.save(confirmation);

        Optional<Personne> personne = personneRepository.findById(nodeId);
        Personne tmpPrsn = personne.get();
        tmpPrsn.setName("En attente");
        tmpPrsn.setEmail(emailOfMemberToAdd);
        personneRepository.save(tmpPrsn);

        emailService.sendRelationshipConfirmationEmail(emailOfMemberToAdd, confirmationCode);

        String notificationMessage = "Un email de confirmation a été envoyé à " + emailOfMemberToAdd;
        simpMessagingTemplate.convertAndSend("/topic/notifications", notificationMessage);

    }

    public String confirmRelationship(String confirmationCode) {
        RelationshipConfirmation confirmation = retrieveConfirmation(confirmationCode);

        boolean isProcessed = confirmation.getIsProcessed();
        if (isProcessed) {
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

    public String confirmRelationshipRefuse(String confirmationCode) {
        RelationshipConfirmation confirmation = retrieveConfirmation(confirmationCode);
        handleDeniedRelationship(confirmation);
        deletePersonne(confirmation);
        return "La demande a été refusé avec succès !";
    }

    private void deletePersonne(RelationshipConfirmation relationshipConfirmation) {
        User targetMember = relationshipConfirmation.getTargetMember();
        Optional<Personne> optTargetPersonne = personneRepository.findByEmail(targetMember.getEmail());
        if (optTargetPersonne.isPresent()) {
            Personne targetPersonne = optTargetPersonne.get();
            deleteRelatedRelations(targetPersonne.getId());
            relationRepository.deleteByPerson_Id(targetPersonne.getId());
            relationshipConfirmationRepository.delete(relationshipConfirmation);
            personneRepository.delete(targetPersonne);
            String notificationMessage = targetPersonne.getEmail() + " a refusé votre demande pour intégrer votre arbre généalogique.";
            simpMessagingTemplate.convertAndSend("/topic/notifications", notificationMessage);
        }
    }

    private void deleteRelatedRelations(Long personId) {
        Optional<List<Relation>> relationsAsPerson = relationRepository.findByPerson_Id(personId);
        relationsAsPerson.ifPresent(relationRepository::deleteAll);

        Optional<List<Relation>> relationsAsMother = relationRepository.findByMother_Id(personId);
        relationsAsMother.ifPresent(relationRepository::deleteAll);

        Optional<List<Relation>> relationsAsFather = relationRepository.findByPartner_Id(personId);
        relationsAsFather.ifPresent(relationRepository::deleteAll);

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

    private void handleConfirmedRelationship(RelationshipConfirmation confirmation) {
        Optional<User> user = userRepository.findById(confirmation.getTargetMember().getId());

        RelationshipConfirmation confirmed = confirmation;
        confirmation.setIsConfirmed(true);
        relationshipConfirmationRepository.save(confirmed);

        // Envoyer une notification WebSocket
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        // Si oui changer dans la bdd les infos de personne par ftp_pro_user
        Optional<Personne> personne = personneRepository.findByEmailAndTreeId(user.get().getEmail(), confirmation.getSourceMember().getId());

        // Assign the retrieved Personne object to a temporary variable for clarity and to avoid multiple calls to .get()
        Personne tmpPrsn = personne.get();


        // Update the Personne object with user details
        String fullName = user.get().getFirstName() + " " + user.get().getLastName();
        tmpPrsn.setName(fullName);
        tmpPrsn.setBorn(user.get().getBirthDate());
        tmpPrsn.setPhoto(user.get().getPhotoPath());
        tmpPrsn.setPhone(user.get().getPhone());
        tmpPrsn.setCity(user.get().getCity());
        tmpPrsn.setCountry(user.get().getNationality());
        tmpPrsn.setAddress(user.get().getAddress());
        // tmpPrsn.setGender(user.get().getGender()); // This line is commented out, as in your original code
        tmpPrsn.setIs_registered(true);

        String notificationMessage = fullName + " a accepté d'être présent sur votre arbre. Rechargez la page si vous êtes actuellement sur l'arbre pour le mettre à jour.";
        simpMessagingTemplate.convertAndSend("/topic/notifications", notificationMessage);

        // Save the updated Personne object to the repository
        personneRepository.save(tmpPrsn);

        // return "La demande a été validée avec succès.";
    }

    private void handleDeniedRelationship(RelationshipConfirmation confirmation) {
        RelationshipConfirmation confirmed = confirmation;
        confirmation.setIsConfirmed(false);
        relationshipConfirmationRepository.save(confirmed);

        // return "La demande a été refusée avec succès.";
    }

    private void markConfirmationAsProcessed(RelationshipConfirmation confirmation) {
        confirmation.setIsProcessed(true);
        relationshipConfirmationRepository.save(confirmation);
    }

}


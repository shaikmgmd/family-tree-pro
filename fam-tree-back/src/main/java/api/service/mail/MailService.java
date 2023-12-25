package api.service.mail;

import api.model.tree.FamilyMember;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    public void sendCodesByEmail(String email, String publicCode, String privateCode) {
        System.out.println("envoie de mail à " + email + " le code privée : " + privateCode);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("familytree.pro2024@gmail.com");
        message.setTo(email);
        message.setSubject("Votre codes d'adhésion pour Arbre Généalogique Pro++");
        message.setText("Merci de vous être inscrit à Arbre Généalogique Pro++. Voici vos codes:\n\n"
                + "Code Public: " + publicCode + "\n"
                + "Code Privé: " + privateCode + "\n\n"
                + "Veuillez conserver ces codes en lieu sûr.");

        mailSender.send(message);
    }

//    public void sendRelationshipConfirmationEmail(FamilyMember sourceMember, String sourceMemberEmail, String confirmationCode) {
//        String confirmationUrl = "http://localhost:8080/api/relationship-confirmation/" + confirmationCode;
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom("familytree.pro2024@gmail.com");
//        message.setTo(sourceMemberEmail);
//        message.setSubject("Vous avez une demande d'ajout dans un arbre généalogique !");
//        message.setText("Merci de vous intéresser à Arbre Généalogique Pro++.\n\n" +
//                " Voici votre lien de confirmation pour intégrer un arbre " +
//                /*+ sourceMember + " :\n\n"*/
//                 confirmationUrl + "\n"
//                + "Veuillez conserver ce lien en lieu sûr.");
//
//        mailSender.send(message);
//    }


    public void sendRelationshipConfirmationEmail(String sourceMemberEmail, String confirmationCode) {
        String confirmationUrl = "http://localhost:3000/confirm-relationship/" + confirmationCode;
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("familytree.pro2024@gmail.com");
        message.setTo(sourceMemberEmail);
        message.setSubject("Vous avez une demande d'ajout dans un arbre généalogique !");
        message.setText("Merci de vous intéresser à Arbre Généalogique Pro++.\n\n" +
                " Voici votre lien de confirmation pour intégrer un arbre " +
                /*+ sourceMember + " :\n\n"*/
                confirmationUrl + "\n"
                + "Veuillez conserver ce lien en lieu sûr.");

        mailSender.send(message);
    }
}

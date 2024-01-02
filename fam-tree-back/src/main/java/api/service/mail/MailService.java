package api.service.mail;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.MessagingException;
import org.springframework.stereotype.Service;

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

    public void sendRelationshipConfirmationEmail(String sourceMemberEmail, String confirmationCode) {
        try {
            String confirmationUrl = "http://localhost:3000/confirm-relationship/" + confirmationCode + "?accept=true";
            String confirmationUrlRefuse = "http://localhost:3000/confirm-relationship/" + confirmationCode+ "?accept=false";

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setFrom("familytree.pro2024@gmail.com");
            helper.setTo(sourceMemberEmail);
            helper.setSubject("Vous avez une demande d'ajout dans un arbre généalogique !");
            String link = "<a href='" + confirmationUrl + "'>Cliquez ici pour accepter</a>";
            String refuseLink = "<a href='" + confirmationUrlRefuse + "'>Cliquez ici pour refuser</a>";
            helper.setText("<html><body>Merci de vous intéresser à Arbre Généalogique Pro++.<br><br>" +
                    "Voici votre lien de confirmation pour intégrer un arbre :<br><br>" +
                    link + "<br>" + refuseLink + "<br>" +
                    "Veuillez conserver ce lien en lieu sûr.</body></html>", true);

            mailSender.send(mimeMessage);
        } catch (MessagingException | jakarta.mail.MessagingException e) {
            System.err.println("Un problème est survenu lors de l'envoi du mail à " + sourceMemberEmail);
            e.printStackTrace();
        }
    }

}

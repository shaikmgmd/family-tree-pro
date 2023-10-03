package api.service.mail;

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
        System.out.println("envoie de mail à "+email+ " le code privée : "+privateCode);
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
}

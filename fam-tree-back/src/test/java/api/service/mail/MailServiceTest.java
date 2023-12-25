package api.service.mail;

import api.model.tree.FamilyMember;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailServiceTest {

    private final JavaMailSender mailSender = mock(JavaMailSender.class);
    private final MailService mailService = new MailService(mailSender);

    @Test
    void sendCodesByEmailTest() {
        String email = "test@example.com";
        String publicCode = "public123";
        String privateCode = "private456";

        mailService.sendCodesByEmail(email, publicCode, privateCode);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage capturedMessage = captor.getValue();
        assertEquals(email, Objects.requireNonNull(capturedMessage.getTo())[0]);
        assertTrue(Objects.requireNonNull(capturedMessage.getText()).contains(publicCode));
        assertTrue(capturedMessage.getText().contains(privateCode));
        assertEquals("Votre codes d'adhésion pour Arbre Généalogique Pro++", capturedMessage.getSubject());
    }

    @Test
    void sendRelationshipConfirmationEmailTest() {
        FamilyMember sourceMember = new FamilyMember();
        String sourceMemberEmail = "source@example.com";
        String confirmationCode = "confirm123";

        mailService.sendRelationshipConfirmationEmail(sourceMember, sourceMemberEmail, confirmationCode);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());

        SimpleMailMessage capturedMessage = captor.getValue();
        assertEquals(sourceMemberEmail, Objects.requireNonNull(capturedMessage.getTo())[0]);
        assertTrue(Objects.requireNonNull(capturedMessage.getText()).contains(confirmationCode));
        assertEquals("Vous avez une demande d'ajout dans un arbre généalogique !", capturedMessage.getSubject());
        assertTrue(capturedMessage.getText().contains("http://localhost:8080/api/relationship-confirmation/"));
    }

}


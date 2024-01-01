package api.service.mail;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;


import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private MimeMessage mimeMessage;

    @InjectMocks
    private MailService mailService;

    @BeforeEach
    void setUp() {
        lenient().when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
    }

    @Test
    void sendCodesByEmail_Success() {
        String email = "test@example.com";
        String publicCode = "publicCode";
        String privateCode = "privateCode";

        // Modifier ici pour stubber le bon type de message
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        mailService.sendCodesByEmail(email, publicCode, privateCode);

        // Modifier ici pour vérifier le bon type de message
        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendRelationshipConfirmationEmail_Success() {
        String email = "test@example.com";
        String confirmationCode = "confirmationCode";

        doNothing().when(mailSender).send(any(MimeMessage.class));

        mailService.sendRelationshipConfirmationEmail(email, confirmationCode);

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }
}

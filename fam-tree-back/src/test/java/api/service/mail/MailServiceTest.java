package api.service.mail;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private MailService mailService;

    @BeforeEach
    void setUp() {
        // Initialiser ici si nécessaire.
    }

    @Test
    void sendCodesByEmail_Success() {
        String email = "test@example.com";
        String publicCode = "publicCode";
        String privateCode = "privateCode";

        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        mailService.sendCodesByEmail(email, publicCode, privateCode);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendRelationshipConfirmationEmail_Success() {
        String email = "test@example.com";
        String confirmationCode = "confirmationCode";

        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        mailService.sendRelationshipConfirmationEmail(email, confirmationCode);

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }


}

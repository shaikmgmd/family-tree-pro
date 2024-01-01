package api.service.relation;

import api.model.tree.Personne;
import api.model.tree.RelationshipConfirmation;
import api.model.user.User;
import api.repository.tree.*;
import api.repository.tree.RelationshipConfirmationRepository;
import api.repository.user.UserRepository;
import api.service.mail.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RelationshipConfirmationServiceTest {

    @Mock
    private UserRepository userRepository;


    @Mock
    private MailService emailService;

    @Mock
    private RelationshipConfirmationRepository relationshipConfirmationRepository;

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private SimpMessagingTemplate simpMessagingTemplate;

    @InjectMocks
    private RelationshipConfirmationService relationshipConfirmationService;

    private String currentPrivateCode = "currentPrivateCode";
    private User user;
    private String email;

    @BeforeEach
    void setUp() {
        User currentUser = new User();
        currentUser.setPrivateCode(currentPrivateCode);
        lenient().when(userRepository.findByPrivateCode(currentPrivateCode)).thenReturn(currentUser);

        SecurityContext securityContext = mock(SecurityContext.class);
        Authentication authentication = mock(Authentication.class);
        SecurityContextHolder.setContext(securityContext);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.getPrincipal()).thenReturn(currentPrivateCode);
    }

    @Test
    void requestRelationshipConfirmation_Success() {
        // Arrange
        String emailOfMemberToAdd = "target@example.com";
        Long nodeId = 1L;
        String confirmationCode = UUID.randomUUID().toString();
        User targetUser = new User();
        targetUser.setEmail(emailOfMemberToAdd);

        when(userRepository.findByEmail(emailOfMemberToAdd)).thenReturn(Optional.of(targetUser));
        when(relationshipConfirmationRepository.findBySourceMemberAndTargetMember(any(User.class), any(User.class))).thenReturn(Optional.empty());
        when(personneRepository.findById(nodeId)).thenReturn(Optional.of(new Personne()));

        doNothing().when(emailService).sendRelationshipConfirmationEmail(anyString(), anyString());
        doNothing().when(simpMessagingTemplate).convertAndSend(anyString(), anyString());

        // Act
        relationshipConfirmationService.requestRelationshipConfirmation(emailOfMemberToAdd, nodeId);

        // Assert
        verify(relationshipConfirmationRepository).save(any(RelationshipConfirmation.class));
        verify(emailService).sendRelationshipConfirmationEmail(eq(emailOfMemberToAdd), anyString());
        verify(simpMessagingTemplate).convertAndSend(eq("/topic/notifications"), anyString());
        // Vous pouvez ajouter plus de vérifications pour des valeurs spécifiques si nécessaire.
    }

    @Test
    void requestRelationshipConfirmation_TargetMemberFoundAndNotAdded_Success() {
        // Arrange
        String emailOfMemberToAdd = "target@example.com";
        Long nodeId = 1L;
        User currUser = new User(); // Configurez cet utilisateur comme nécessaire
        currUser.setPrivateCode("currentPrivateCode");
        User targetUser = new User();
        targetUser.setEmail(emailOfMemberToAdd);

        // Simuler le contexte de sécurité
        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("currentPrivateCode", null));

        when(userRepository.findByPrivateCode(anyString())).thenReturn(currUser);
        when(userRepository.findByEmail(emailOfMemberToAdd)).thenReturn(Optional.of(targetUser));
        when(relationshipConfirmationRepository.findBySourceMemberAndTargetMember(any(User.class), any(User.class))).thenReturn(Optional.empty());
        when(personneRepository.findById(anyLong())).thenReturn(Optional.of(new Personne()));

        doNothing().when(emailService).sendRelationshipConfirmationEmail(anyString(), anyString());
        doNothing().when(simpMessagingTemplate).convertAndSend(anyString(), anyString());

        // Act
        relationshipConfirmationService.requestRelationshipConfirmation(emailOfMemberToAdd, nodeId);

        // Assert
        verify(relationshipConfirmationRepository).save(any(RelationshipConfirmation.class));
        verify(emailService).sendRelationshipConfirmationEmail(eq(emailOfMemberToAdd), anyString());
        verify(simpMessagingTemplate).convertAndSend(eq("/topic/notifications"), anyString());
        // Ajoutez d'autres vérifications pour les propriétés mises à jour de 'Personne' si nécessaire.
    }

    @Test
    void requestRelationshipConfirmation_TargetMemberNotFound_ThrowsException() {
        // Arrange
        String emailOfMemberToAdd = "target@example.com";
        Long nodeId = 1L;
        User currUser = new User();
        currUser.setPrivateCode("currentPrivateCode");

        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("currentPrivateCode", null));

        when(userRepository.findByPrivateCode(anyString())).thenReturn(currUser);
        when(userRepository.findByEmail(emailOfMemberToAdd)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> relationshipConfirmationService.requestRelationshipConfirmation(emailOfMemberToAdd, nodeId),
                "User not found");
    }

    @Test
    void requestRelationshipConfirmation_TargetMemberAlreadyAdded_ThrowsException() {
        // Arrange
        String emailOfMemberToAdd = "target@example.com";
        Long nodeId = 1L;
        User currUser = new User();
        currUser.setPrivateCode("currentPrivateCode");
        User targetUser = new User();

        SecurityContextHolder.getContext().setAuthentication(new TestingAuthenticationToken("currentPrivateCode", null));

        when(userRepository.findByPrivateCode(anyString())).thenReturn(currUser);
        when(userRepository.findByEmail(emailOfMemberToAdd)).thenReturn(Optional.of(targetUser));
        when(relationshipConfirmationRepository.findBySourceMemberAndTargetMember(any(User.class), any(User.class))).thenReturn(Optional.of(new RelationshipConfirmation()));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> relationshipConfirmationService.requestRelationshipConfirmation(emailOfMemberToAdd, nodeId),
                "User already add");
    }

    @Test
    void confirmRelationship_Success() {
        // Arrange
        String confirmationCode = "testConfirmationCode";
        Long targetUserId = 1L;
        Long sourceUserId = 2L;

        User targetUser = new User();
        targetUser.setId(targetUserId);
        Date date = new Date(1990, 1, 1);
        targetUser.setBirthDate(date);

        User sourceUser = new User();
        sourceUser.setId(sourceUserId);

        RelationshipConfirmation confirmation = new RelationshipConfirmation();
        confirmation.setConfirmationCode(confirmationCode);
        confirmation.setTargetMember(targetUser);
        confirmation.setSourceMember(sourceUser);
        confirmation.setExpiryDate(LocalDateTime.now().plusDays(1));
        confirmation.setIsProcessed(false);
        confirmation.setIsConfirmed(false);

        lenient().when(relationshipConfirmationRepository.findByConfirmationCode(confirmationCode)).thenReturn(Optional.of(confirmation));
        lenient().when(userRepository.findById(targetUserId)).thenReturn(Optional.of(targetUser)); // Utilisez l'ID correct
        lenient().when(personneRepository.findByEmail(targetUser.getEmail())).thenReturn(Optional.of(new Personne())); // Assurez-vous que l'email est défini

        // Act
        String result = relationshipConfirmationService.confirmRelationship(confirmationCode);

        // Assert
        assertEquals("Confirmation validé", result, "Le résultat devrait indiquer que la confirmation a été validée.");

        // Vérifiez que la méthode save a été appelée deux fois si c'est le comportement attendu
        verify(relationshipConfirmationRepository, times(2)).save(any(RelationshipConfirmation.class));

        // Vérifiez que la méthode save a été appelée sur personneRepository
        verify(personneRepository).save(any(Personne.class));
    }

}

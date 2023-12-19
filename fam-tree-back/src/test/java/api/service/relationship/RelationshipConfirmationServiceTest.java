package api.service.relationship;

import api.model.tree.FamilyMember;
import api.model.tree.relationship.RelationshipConfirmation;
import api.model.tree.relationship.RelationshipType;
import api.model.user.User;
import api.repository.tree.FamilyMemberRepository;
import api.repository.tree.RelationshipConfirmationRepository;
import api.repository.tree.RelationshipRepository;
import api.repository.user.UserRepository;
import api.service.mail.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RelationshipConfirmationServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RelationshipConfirmationRepository confirmationRepository;
    @Mock
    private FamilyMemberRepository familyMemberRepository;
    @Mock
    private MailService emailService;
    @Mock
    private RelationshipRepository relationshipRepository;

    @InjectMocks
    private RelationshipConfirmationService relationshipConfirmationService;

    private FamilyMember sourceMember;
    private User user;
    private String email;
    private RelationshipType relationshipType;
    private String confirmationCode;

    @BeforeEach
    void setUp() {
        sourceMember = new FamilyMember();
        user = new User();
        email = "test@example.com";
        relationshipType = RelationshipType.PARENT;
        confirmationCode = UUID.randomUUID().toString();

        sourceMember.setId(1L);
        user.setId(1L);
        user.setEmail(email);
        user.setFirstName("John");
    }

    @Test
    void requestRelationshipConfirmationUserExistsTest() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(familyMemberRepository.findByUserId(anyLong())).thenReturn(Optional.empty());

        relationshipConfirmationService.requestRelationshipConfirmation(email, sourceMember, relationshipType);

        verify(confirmationRepository).save(any(RelationshipConfirmation.class));
        verify(emailService).sendRelationshipConfirmationEmail(eq(sourceMember), eq(email), anyString());
    }

    @Test
    void requestRelationshipConfirmationUserNotFoundTest() {
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            relationshipConfirmationService.requestRelationshipConfirmation(email, sourceMember, relationshipType);
        });
    }

    @Test
    void confirmRelationshipValidTest() {
        FamilyMember targetMember = new FamilyMember();
        targetMember.setId(2L);

        RelationshipConfirmation confirmation = createMockConfirmation();
        confirmation.setTargetMember(targetMember);

        when(confirmationRepository.findByConfirmationCode(confirmationCode)).thenReturn(Optional.of(confirmation));
        when(familyMemberRepository.findById(targetMember.getId())).thenReturn(Optional.of(targetMember));

        String result = relationshipConfirmationService.confirmRelationship(confirmationCode);

        assertEquals("Confirmation pour le code " + confirmationCode + " validée", result);
        verify(relationshipRepository).save(any());
        verify(confirmationRepository, times(2)).save(any(RelationshipConfirmation.class));

    }

    @Test
    void confirmRelationshipInvalidCodeTest() {
        when(confirmationRepository.findByConfirmationCode("invalidCode")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            relationshipConfirmationService.confirmRelationship("invalidCode");
        });
    }

    private RelationshipConfirmation createMockConfirmation() {
        RelationshipConfirmation confirmation = new RelationshipConfirmation();
        confirmation.setConfirmationCode(confirmationCode);
        confirmation.setExpiryDate(LocalDateTime.now().plusDays(7));
        confirmation.setSourceMember(sourceMember);
        confirmation.setTargetMember(new FamilyMember());
        confirmation.setRelationshipType(relationshipType);
        confirmation.setIsProcessed(false);
        return confirmation;
    }
}

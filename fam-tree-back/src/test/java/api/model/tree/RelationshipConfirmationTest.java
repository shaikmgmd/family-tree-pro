package api.model.tree;

import api.model.user.User;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class RelationshipConfirmationTest {
    @Test
    void testRelationshipConfirmationAttributesAndRelations() {
        // Créer des instances de User pour simuler les relations
        User sourceMember = new User();
        sourceMember.setId(1L);

        User targetMember = new User();
        targetMember.setId(2L);

        // Créer une instance de RelationshipConfirmation
        RelationshipConfirmation confirmation = new RelationshipConfirmation();

        // Définir les attributs
        Long id = 1L;
        String confirmationCode = "123ABC";
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(1);
        Boolean isConfirmed = false;
        Boolean isProcessed = false;

        // Configurer l'instance de RelationshipConfirmation
        confirmation.setId(id);
        confirmation.setConfirmationCode(confirmationCode);
        confirmation.setSourceMember(sourceMember);
        confirmation.setTargetMember(targetMember);
        confirmation.setExpiryDate(expiryDate);
        confirmation.setIsConfirmed(isConfirmed);
        confirmation.setIsProcessed(isProcessed);

        // Vérifier les valeurs avec les getters
        assertEquals(id, confirmation.getId());
        assertEquals(confirmationCode, confirmation.getConfirmationCode());
        assertEquals(sourceMember, confirmation.getSourceMember());
        assertEquals(targetMember, confirmation.getTargetMember());
        assertEquals(expiryDate, confirmation.getExpiryDate());
        assertEquals(isConfirmed, confirmation.getIsConfirmed());
        assertEquals(isProcessed, confirmation.getIsProcessed());
    }
}

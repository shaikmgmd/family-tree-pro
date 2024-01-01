package api.model.chat;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ChatTest {

    @Test
    void testChatGettersAndSetters() {
        // Créer une instance de Chat
        Chat chat = new Chat();
        chat.setId(1L);
        chat.setUserId1(10L);
        chat.setUserId2(20L);

        // Vérifier les getters
        assertEquals(1L, chat.getId());
        assertEquals(10L, chat.getUserId1());
        assertEquals(20L, chat.getUserId2());
    }

    @Test
    void testChatAllArgsConstructor() {
        // Utiliser le constructeur avec paramètres pour créer une instance
        Chat chat = new Chat(1L, 10L, 20L);

        // Vérifier les valeurs à l'aide des getters
        assertEquals(1L, chat.getId());
        assertEquals(10L, chat.getUserId1());
        assertEquals(20L, chat.getUserId2());
    }

    @Test
    void testChatToString() {
        // Créer une instance de Chat
        Chat chat = new Chat(1L, 10L, 20L);

        // Vérifier que toString produit le format attendu (sans les messages)
        String expectedString = "Chat{id=1, userId1=10, userId2=20}";
        assertEquals(expectedString, chat.toString());
    }
}

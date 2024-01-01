package api.model.chat;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ChatMessageTest {

    @Test
    void testChatMessageGettersAndSetters() {
        // Créer une instance de ChatMessage
        ChatMessage chatMessage = new ChatMessage();
        Chat chat = new Chat(); // Supposons que chat est déjà initialisé correctement

        // Définir des valeurs
        chatMessage.setId(1L);
        chatMessage.setSenderName("Sender");
        chatMessage.setReceiverName("Receiver");
        chatMessage.setMessage("Hello World!");
        chatMessage.setDate(LocalDateTime.now());
        chatMessage.setChat(chat);

        // Vérifier les getters
        assertEquals(1L, chatMessage.getId());
        assertEquals("Sender", chatMessage.getSenderName());
        assertEquals("Receiver", chatMessage.getReceiverName());
        assertEquals("Hello World!", chatMessage.getMessage());
        assertNotNull(chatMessage.getDate());
        assertEquals(chat, chatMessage.getChat());
    }

    @Test
    void testChatMessageConstructor() {
        // Créer une instance de Chat et ChatMessage
        Chat chat = new Chat(); // Supposons que chat est déjà initialisé correctement
        ChatMessage chatMessage = new ChatMessage(chat, "Sender", "Receiver", "Hello World!");

        // Vérifier les valeurs initialisées par le constructeur
        assertEquals("Sender", chatMessage.getSenderName());
        assertEquals("Receiver", chatMessage.getReceiverName());
        assertEquals("Hello World!", chatMessage.getMessage());
        assertNotNull(chatMessage.getDate()); // La date doit être initialisée à maintenant
        assertEquals(chat, chatMessage.getChat());
    }

    @Test
    void testChatMessageToString() {
        // Créer une instance de ChatMessage
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setId(1L);
        chatMessage.setSenderName("Sender");
        chatMessage.setReceiverName("Receiver");
        chatMessage.setMessage("Hello World!");
        LocalDateTime now = LocalDateTime.now();
        chatMessage.setDate(now);

        // Vérifier que toString produit le format attendu
        String expectedString = "ChatMessage{id=1, senderName='Sender', receiverName='Receiver', message='Hello World!', date='" + now + "', chat=null}";
        assertEquals(expectedString, chatMessage.toString());
    }
}

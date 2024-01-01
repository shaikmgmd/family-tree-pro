package api.model.chat;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ChatMessageDAOTest {
    @Test
    void testChatMessageDAOGettersAndSetters() {
        // Créer une instance de ChatMessageDAO
        ChatMessageDAO chatMessageDAO = new ChatMessageDAO();

        // Définir des valeurs
        chatMessageDAO.setChatId(1);
        chatMessageDAO.setSenderId(100);
        chatMessageDAO.setReceiverId(200);
        chatMessageDAO.setMessage("Hello World!");

        // Vérifier les getters
        assertEquals(1, chatMessageDAO.getChatId());
        assertEquals(100, chatMessageDAO.getSenderId());
        assertEquals(200, chatMessageDAO.getReceiverId());
        assertEquals("Hello World!", chatMessageDAO.getMessage());
    }

    @Test
    void testChatMessageDAOToString() {
        // Créer une instance de ChatMessageDAO
        ChatMessageDAO chatMessageDAO = new ChatMessageDAO();
        chatMessageDAO.setChatId(1);
        chatMessageDAO.setSenderId(100);
        chatMessageDAO.setReceiverId(200);
        chatMessageDAO.setMessage("Hello World!");

        // Construire la chaîne attendue
        String expectedString = "ChatMessageDAO(chatId=1, senderId=100, receiverId=200, message=Hello World!)";

        // Vérifier que toString produit le format attendu
        assertEquals(expectedString, chatMessageDAO.toString());
    }
}

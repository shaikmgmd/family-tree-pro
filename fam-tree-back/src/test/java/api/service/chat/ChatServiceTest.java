package api.service.chat;

import api.model.chat.Chat;
import api.model.chat.ChatMessage;
import api.model.chat.ChatMessageDAO;
import api.model.user.User;
import api.repository.chat.ChatMessageRepository;
import api.repository.chat.ChatRepository;
import api.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ChatServiceTest {

    @Mock
    private ChatRepository chatRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ChatMessageRepository chatMessageRepository;

    @InjectMocks
    private ChatService chatService;

    private User testUser;
    private Chat testChat;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);

        testChat = new Chat();
        testChat.setId(1L);
    }


    @Test
    void getUserChatsWithMessages_Success() {
        Long userId = 1L;
        when(chatRepository.findAllByUserId1AndUserId2(userId, userId)).thenReturn(Optional.of(Collections.singletonList(testChat)));
        when(chatMessageRepository.findByChatId(anyLong())).thenReturn(Collections.singletonList(new ChatMessage()));

        List<Chat> chats = chatService.getUserChatsWithMessages(userId);

        assertNotNull(chats);
        assertFalse(chats.isEmpty());
        verify(chatMessageRepository).findByChatId(anyLong());
    }

    @Test
    void saveChatMessage_Success() {
        ChatMessageDAO chatMessageDAO = new ChatMessageDAO();
        when(chatRepository.findChatByUsers(anyLong(), anyLong())).thenReturn(Optional.of(testChat));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));
        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(i -> i.getArgument(0));

        ChatMessage result = chatService.saveChatMessage(chatMessageDAO);

        assertNotNull(result);
        verify(chatMessageRepository).save(any(ChatMessage.class));
    }

    @Test
    void saveChatMessage_Failure() {
        ChatMessageDAO chatMessageDAO = new ChatMessageDAO();
        when(chatRepository.findChatByUsers(anyLong(), anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> chatService.saveChatMessage(chatMessageDAO));
    }

/*    @Test
    void getChatMessages_Success() {
        Long chatId = 1L;
        when(chatMessageRepository.findByChatId(chatId)).thenReturn(Collections.singletonList(new ChatMessage()));

        List<ChatMessage> messages = chatService.getChatMessages(chatId);

        assertNotNull(messages);
        assertFalse(messages.isEmpty());
    }*/

    @Test
    void createOrGetChat_ExistingChat() {
        Long userId1 = 1L, userId2 = 2L;
        when(chatRepository.findChatByUsers(userId1, userId2)).thenReturn(Optional.of(testChat));

        Chat chat = chatService.createOrGetChat(userId1, userId2);

        assertNotNull(chat);
        verify(chatRepository, never()).save(any(Chat.class));
    }

    @Test
    void createOrGetChat_NewChat() {
        Long userId1 = 1L, userId2 = 2L;
        when(chatRepository.findChatByUsers(userId1, userId2)).thenReturn(Optional.empty());
        when(chatRepository.save(any(Chat.class))).thenAnswer(i -> i.getArgument(0));

        Chat chat = chatService.createOrGetChat(userId1, userId2);

        assertNotNull(chat);
        verify(chatRepository).save(any(Chat.class));
    }

}

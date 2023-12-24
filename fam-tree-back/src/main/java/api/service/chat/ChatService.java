package api.service.chat;

import api.model.chat.Chat;
import api.model.chat.ChatMessage;
import api.repository.chat.ChatMessageRepository;
import api.repository.chat.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatMessageRepository chatMessageRepository;

    public List<Chat> getUserChatsWithMessages(Long userId) {
        Optional<List<Chat>> chatsOpt = chatRepository.findByUserId1AndUserId2(userId, userId);
        List<Chat> chats;
        if(chatsOpt.isPresent()) {
            chats = chatsOpt.get();
        } else {
            throw new RuntimeException("List<Chat> not found");
        }
        chats.forEach(chat -> {
            List<ChatMessage> messages = chatMessageRepository.findByChatId(chat.getId());
            chat.setMessages(messages);
        });

        return chats;
    }

    public ChatMessage saveChatMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    public List<ChatMessage> getChatMessages(Long chatId) {
        return chatMessageRepository.findByChatId(chatId);
    }

    public Chat createOrGetChat(Long userId1, Long userId2) {
        return (Chat) chatRepository.findByUserId1AndUserId2(userId1, userId2)
                .orElseGet(() -> {
                    Chat newChat = new Chat();
                    newChat.setUserId1(userId1);
                    newChat.setUserId2(userId2);
                    return Collections.singletonList(chatRepository.save(newChat));
                });
    }
}

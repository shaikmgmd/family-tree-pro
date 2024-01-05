package api.service.chat;

import api.model.chat.Chat;
import api.model.chat.ChatMessage;
import api.model.chat.ChatMessageDAO;
import api.model.chat.ChatMessagePublishedDTO;
import api.model.user.User;
import api.repository.chat.ChatMessageRepository;
import api.repository.chat.ChatRepository;
import api.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public List<Chat> getUserChatsWithMessages(Long userId) {
        Optional<List<Chat>> chatsOpt = chatRepository.findAllByUserId1AndUserId2(userId, userId);
        List<Chat> chats;
        if (chatsOpt.isPresent()) {
            chats = chatsOpt.get();
        } else {
            throw new RuntimeException("List<Chat> not found");
        }
        chats.forEach(chat -> {
            List<ChatMessage> messages = chatMessageRepository.findByChatId(chat.getId());
            // chat.setMessages(messages);
        });

        return chats;
    }

    public ChatMessage saveChatMessage(ChatMessageDAO chatMessageDAO) {
        ChatMessage chatMessage = null;
        Optional<Chat> chatOpt = chatRepository.findChatByUsers((long) chatMessageDAO.getSenderId(), (long) chatMessageDAO.getReceiverId());
        Optional<User> userOpt1 = userRepository.findById((long) chatMessageDAO.getSenderId());
        Optional<User> userOpt2 = userRepository.findById((long) chatMessageDAO.getReceiverId());
        if (chatOpt.isPresent() && userOpt1.isPresent() && userOpt2.isPresent()) {
            chatMessage = new ChatMessage(chatOpt.get(), userOpt1.get().getLastName(), userOpt2.get().getLastName(), chatMessageDAO.getMessage());
            return chatMessageRepository.save(chatMessage);
        } else {
            throw new RuntimeException("Can't send message");
        }
    }

    public List<ChatMessagePublishedDTO> getChatMessages(Long chatId) {
        List<ChatMessage> messages = chatMessageRepository.findByChatId(chatId);
        List<ChatMessagePublishedDTO> messageDTOs = new ArrayList<>();

        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        if (!chatOpt.isPresent()) {
            return Collections.emptyList();
        }

        Chat chat = chatOpt.get();
        Optional<User> userOpt1 = userRepository.findById(chat.getUserId1());
        Optional<User> userOpt2 = userRepository.findById(chat.getUserId2());

        // S'assurer que les deux utilisateurs existent
        if (!userOpt1.isPresent() || !userOpt2.isPresent()) {
            // Gérer l'absence d'utilisateurs ici
            return Collections.emptyList();
        }

        User senderUser = userOpt1.get();
        User receiverUser = userOpt2.get();

        for (ChatMessage message : messages) {
            ChatMessagePublishedDTO dto = getChatMessagePublishedDTO(message, senderUser, receiverUser);
            messageDTOs.add(dto);
        }

        return messageDTOs;
    }

    private static ChatMessagePublishedDTO getChatMessagePublishedDTO(ChatMessage message, User senderUser, User receiverUser) {
        ChatMessagePublishedDTO dto = new ChatMessagePublishedDTO();
        dto.setId(message.getId());
        dto.setSenderName(message.getSenderName());
        dto.setReceiverName(message.getReceiverName());
        dto.setSenderId(senderUser.getId());
        dto.setReceiverId(receiverUser.getId());
        dto.setMessage(message.getMessage());
        dto.setDate(message.getDate());
        dto.setSenderPhotoPath(senderUser.getPhotoPath());
        dto.setReceiverPhotoPath(receiverUser.getPhotoPath());
//        if (message.getSenderName().equals(senderUser.getLastName())) {
//            dto.setSenderPhotoPath(senderUser.getPhotoPath());
//            dto.setReceiverPhotoPath(receiverUser.getPhotoPath());
//        } else {
//            dto.setSenderPhotoPath(receiverUser.getPhotoPath());
//            dto.setReceiverPhotoPath(senderUser.getPhotoPath());
//        }
        return dto;
    }


    public Chat createOrGetChat(Long userId1, Long userId2) {
        // Essayez d'abord de trouver le chat existant
        Optional<Chat> existingChat = chatRepository.findChatByUsers(userId1, userId2);

        System.out.println(existingChat);
        // Si le chat existe, retournez-le
        if (existingChat.isPresent()) {
            System.out.println("existingChat.get()" + existingChat.get().toString());
            return existingChat.get();
        }

        // Sinon, créez un nouveau chat et retournez-le
        Chat newChat = new Chat();
        newChat.setUserId1(userId1);
        newChat.setUserId2(userId2);
        return chatRepository.save(newChat);
    }

}

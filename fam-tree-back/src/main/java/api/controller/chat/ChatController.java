package api.controller.chat;

import api.common.ApiResponse;
import api.model.chat.Chat;
import api.model.chat.ChatMessage;
import api.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base.url}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @GetMapping("/{userId}/chats")
    public ResponseEntity<List<Chat>> getUserChatsWithMessages(@PathVariable Long userId) {
        List<Chat> chats = chatService.getUserChatsWithMessages(userId);
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatMessage>> sendChatMessage(@RequestBody ChatMessage chatMessage) {
        ChatMessage savedMessage = chatService.saveChatMessage(chatMessage);
        return new ResponseEntity<>(new ApiResponse<>(savedMessage), HttpStatus.CREATED);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatId) {
        List<ChatMessage> messages = chatService.getChatMessages(chatId);
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping("/start")
    public ResponseEntity<Chat> startChat(@RequestParam Long userId1, @RequestParam Long userId2) {
        Chat chat = chatService.createOrGetChat(userId1, userId2);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

}

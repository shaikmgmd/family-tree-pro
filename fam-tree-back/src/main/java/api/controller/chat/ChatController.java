package api.controller.chat;

import api.common.ApiResponse;
import api.model.chat.Chat;
import api.model.chat.ChatMessage;
import api.model.chat.ChatMessageDAO;
import api.model.chat.ChatMessagePublishedDTO;
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
    public ResponseEntity<ApiResponse<List<Chat>>> getUserChatsWithMessages(@PathVariable Long userId) {
        ApiResponse<List<Chat>> chats = new ApiResponse<>(chatService.getUserChatsWithMessages(userId));
        return new ResponseEntity<>(chats, HttpStatus.OK);
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatMessage>> sendChatMessage(@RequestBody ChatMessageDAO chatMessage) {
        System.out.println("chatMessage -->"+chatMessage);
        ApiResponse<ChatMessage> savedMessage = new ApiResponse<>(chatService.saveChatMessage(chatMessage));
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessagePublishedDTO>>> getChatMessages(@PathVariable Long chatId) {
        ApiResponse<List<ChatMessagePublishedDTO>> messages = new ApiResponse<>(chatService.getChatMessages(chatId));
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<Chat>> startChat(@RequestParam(name = "userId1") Long userId1,
                                                       @RequestParam(name = "userId2") Long userId2) {
        ApiResponse<Chat> chat = new ApiResponse<>(chatService.createOrGetChat(userId1, userId2));
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

}

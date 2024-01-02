package api.controller.ws;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

// WebSocket controller
@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/broadcast")
    @SendTo("/topic/reply")
    public String broadcastMessage(@Payload String message) {
        return "You have received a message: " + message;
    }

    @MessageMapping("/user-message")
    @SendToUser("/queue/reply")
    public String sendBackToUser(@Payload String message, @Header("simpSessionId") String sessionId) {
        return "Only you have received this message: " + message;
    }

    @MessageMapping("/user-message-{userName}")
    public void sendToOtherUser(@Payload String message, @DestinationVariable String userName, @Header("simpSessionId") String sessionId) {
        simpMessagingTemplate.convertAndSend("/queue/reply-" + userName, "You have a message from someone: " + message);
    }
}

package api.model.chat;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class ChatMessageDAO {
    private int chatId;
    private int senderId;
    private int receiverId;
    private String message;
}

package api.model.chat;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessagePublishedDTO {
    private Long id;
    private String senderName;
    private Long senderId;
    private String receiverName;
    private Long receiverId;
    private String message;
    private LocalDateTime date;
    private String senderPhotoPath;
    private String receiverPhotoPath;
}


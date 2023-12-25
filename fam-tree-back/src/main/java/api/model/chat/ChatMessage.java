package api.model.chat;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "chat_message")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_name")
    private String senderName;

    @Column(name = "receiver_name")
    private String receiverName;

    @Column(name = "message")
    private String message;

    @Column(name = "date")
    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    public ChatMessage(Chat chat, String senderName, String receiverName, String message) {
        this.chat = chat;
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.message = message;
        this.date = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "ChatMessage{" +
                "id=" + id +
                ", senderName='" + senderName + '\'' +
                ", receiverName='" + receiverName + '\'' +
                ", message='" + message + '\'' +
                ", date='" + date + '\'' +
                ", chat=" + chat +
                '}';
    }
}
package api.model.chat;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id_1")
    private Long userId1;

    @Column(name = "user_id_2")
    private Long userId2;

    @Override
    public String toString() {
        return "Chat{" +
                "id=" + id +
                ", userId1=" + userId1 +
                ", userId2=" + userId2 +
                // Ne pas imprimer les messages pour éviter les références circulaires
                // ", messages=" + messages +
                '}';
    }
}
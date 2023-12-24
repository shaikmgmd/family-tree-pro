package api.repository.chat;

import api.model.chat.Chat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<List<Chat>> findByUserId1AndUserId2(Long userId1, Long userId2);
}

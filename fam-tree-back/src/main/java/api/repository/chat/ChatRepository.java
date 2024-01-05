package api.repository.chat;

import api.model.chat.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<List<Chat>> findAllByUserId1AndUserId2(Long userId1, Long userId2);

    @Query("SELECT c FROM Chat c WHERE (c.userId1 = :userId1 AND c.userId2 = :userId2) OR (c.userId1 = :userId2 AND c.userId2 = :userId1)")
    Optional<Chat> findChatByUsers(Long userId1, Long userId2);
    Optional<Chat> findById(Long chatId);


    List<Chat> findAllByUserId1OrUserId2(Long id, Long id1);
}

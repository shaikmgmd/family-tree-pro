package api.repository.user;

import java.util.Optional;

import api.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    User findUserByEmail(String email);
    boolean existsByEmail(String email);
    User findByPrivateCode(String privateCode);
}

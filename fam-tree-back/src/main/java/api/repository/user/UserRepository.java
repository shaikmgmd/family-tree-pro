package api.repository.user;

import java.util.List;
import java.util.Optional;

import api.model.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
//
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    User findByPrivateCode(String privateCode);
    Optional<User> findById(Long userId);
    Optional<User> findByEmail(String email);
    Page<User> findAll(Pageable pageable);

    List<User> findAllByEmail(String email);
}

package api.repository.user_role;
import api.model.role.Role;
import api.model.user.User;
import api.model.user_role.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
//
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    void deleteByUserAndRole(User user, Role role);
    Optional<UserRole> findByUserAndRole(User user, Role role);
}



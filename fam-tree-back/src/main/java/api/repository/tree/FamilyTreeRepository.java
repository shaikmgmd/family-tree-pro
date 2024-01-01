package api.repository.tree;

import api.model.tree.FamilyTree;
import api.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
//
public interface FamilyTreeRepository extends JpaRepository<FamilyTree, Long> {

    Optional<FamilyTree> findByUser(User user);
    Optional<FamilyTree> findByUserId(Long userId);
}

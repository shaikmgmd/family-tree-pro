package api.repository.tree;

import api.model.tree.FamilyMember;
import api.model.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {

    Optional<FamilyMember> findByUserId(Long userId);
    Optional<FamilyMember> findByTreeId(Long treeId);
    Optional<FamilyMember> findByName(String name);
}
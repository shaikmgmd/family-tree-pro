package api.repository.tree;

import api.model.tree.Personne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
//
public interface PersonneRepository extends JpaRepository<Personne, Long> {
    List<Personne> findByTreeId(Long treeId);
    Optional<Personne> findByEmail(String email);
    Optional<Personne> findByTempId(String tempId);

    Optional<Personne> findByEmailAndTreeId(String email, Long treeId);

    boolean existsByEmailAndTreeId(String email, Long treeId);

    // Method to check if a person with the same email exists but with a different treeId
    default boolean canAddPersonWithSameEmail(String email, Long treeId) {
        return !existsByEmailAndTreeId(email, treeId);
    }
}

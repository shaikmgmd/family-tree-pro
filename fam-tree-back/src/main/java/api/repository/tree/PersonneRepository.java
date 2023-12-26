package api.repository.tree;

import api.model.tree.Personne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
//
public interface PersonneRepository extends JpaRepository<Personne, Long> {
    List<Personne> findByTreeId(Long treeId);

    Optional<Personne> findByEmail(String email);
}

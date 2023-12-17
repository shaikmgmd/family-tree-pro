package api.repository.tree;

import api.model.tree.Personne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonneRepository extends JpaRepository<Personne, Long> {
    List<Personne> findByTreeId(Long treeId);
}

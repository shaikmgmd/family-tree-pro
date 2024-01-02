package api.repository.tree;

import api.model.tree.Relation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
//
public interface RelationRepository extends JpaRepository<Relation, Long> {
    @Query("SELECT r FROM Relation r WHERE r.person.treeId = :treeId "
            //+
            //"OR r.partner.treeId = :treeId " +
            //"OR r.mother.treeId = :treeId " +
            //"OR r.father.treeId = :treeId"
    )
    List<Relation> findByPersonTreeId(@Param("treeId") Long treeId);
    Optional<List<Relation>> findByPerson_Id(Long personId);

    Optional<List<Relation>> findByMother_Id(Long personId);

    Optional<List<Relation>> findByFather_Id(Long personId);

    Optional<List<Relation>> findByPartner_Id(Long personId);

    Optional<List<Relation>> findByMother_IdOrFather_Id(Long motherId, Long fatherId);

    //Optional<List<Relation>> findByTree_Id(Long treeId);

    void deleteByPerson_Id(Long id);
}


package api.model.tree;

import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class RelationTest {
    @Test
    void testRelationAttributesAndRelations() {
        // Créer des instances de Personne pour simuler les relations
        Personne person = new Personne();
        person.setId(1L);

        Personne partner = new Personne();
        partner.setId(2L);

        Personne mother = new Personne();
        mother.setId(3L);

        Personne father = new Personne();
        father.setId(4L);

        // Créer une instance de Relation
        Relation relation = new Relation();

        // Définir les attributs et les relations
        Long id = 1L;
        relation.setId(id);
        relation.setPerson(person);
        relation.setPartner(partner);
        relation.setMother(mother);
        relation.setFather(father);

        // Vérifier les valeurs avec les getters
        assertEquals(id, relation.getId());
        assertEquals(person, relation.getPerson());
        assertEquals(partner, relation.getPartner());
        assertEquals(mother, relation.getMother());
        assertEquals(father, relation.getFather());
    }
}

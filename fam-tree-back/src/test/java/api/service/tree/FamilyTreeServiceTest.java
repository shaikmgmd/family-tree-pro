package api.service.tree;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.Relation;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.RelationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

@ExtendWith(MockitoExtension.class)
public class FamilyTreeServiceTest {

    @InjectMocks
    private FamilyTreeService familyTreeService;

    @Mock
    private FamilyTreeRepository familyTreeRepository;

    @Mock
    private PersonneService personneService;

    @Mock
    private RelationRepository relationRepository;


    @Test
    public void getFamilyTreeByUserId_found() {
        Long userId = 1L;
        FamilyTree tree = new FamilyTree();
        when(familyTreeRepository.findByUserId(userId)).thenReturn(Optional.of(tree));

        List<Map<String, Object>> mockPersonList = new ArrayList<>();
        Map<String, Object> person1 = new HashMap<>();
        person1.put("id", 1);
        person1.put("name", "John Doe");
        mockPersonList.add(person1);

        when(personneService.findByTreeId(tree.getId())).thenReturn(mockPersonList);

        // action
        var result = familyTreeService.getFamilyTreeByUserId(userId);

        // vérification
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(mockPersonList, result);
    }

    @Test
    public void getFamilyTreeByUserId_notFound() {
        Long userId = 1L;
        when(familyTreeRepository.findByUserId(userId)).thenReturn(Optional.empty());

        // action and verification
        assertThrows(EntityNotFoundException.class, () -> familyTreeService.getFamilyTreeByUserId(userId));
    }

    @Test
    public void traverseBFS_withValidRootPerson_returnsVisited() {
        Personne rootPerson = new Personne();
        rootPerson.setId(1L);

        List<Relation> mockRelations = new ArrayList<>();
        when(relationRepository.findByPerson_Id(rootPerson.getId())).thenReturn(Optional.of(mockRelations));

        // action
        var result = familyTreeService.traverseBFS(rootPerson);

        // vérification
        assertNotNull(result);
    }


    @Test
    public void traverseBFS_withNullRootPerson_returnsEmptyList() {
        // action
        var result = familyTreeService.traverseBFS(null);

        // vérification
        assertTrue(result.isEmpty());
    }

    @Test
    public void traverseDFS_withValidRootPerson_returnsVisited() {
        Personne rootPerson = new Personne();
        rootPerson.setId(1L);

        List<Relation> mockRelations = new ArrayList<>();
        when(relationRepository.findByPerson_Id(rootPerson.getId())).thenReturn(Optional.of(mockRelations));

        // action
        var result = familyTreeService.traverseDFS(rootPerson);

        // vérification
        assertNotNull(result);
    }

    @Test
    public void traverseDFS_withNullRootPerson_returnsEmptySet() {
        // action
        var result = familyTreeService.traverseDFS(null);

        // vérification
        assertTrue(result.isEmpty());
    }

    @Test
    public void getFamilyTreeByUserId_whenUserExists_returnsFamilyTree() {
        Long userId = 1L;
        FamilyTree tree = new FamilyTree();
        when(familyTreeRepository.findByUserId(userId)).thenReturn(Optional.of(tree));

        List<Map<String, Object>> mockPersonList = new ArrayList<>();
        Map<String, Object> person1 = new HashMap<>();
        person1.put("id", 1);
        person1.put("name", "John Doe");
        mockPersonList.add(person1);

        when(personneService.findByTreeId(tree.getId())).thenReturn(mockPersonList);

        var result = familyTreeService.getFamilyTreeByUserId(userId);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(mockPersonList, result);
    }

    @Test
    public void getFamilyTreeByUserId_whenUserDoesNotExist_throwsEntityNotFoundException() {
        Long userId = 1L;
        when(familyTreeRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> familyTreeService.getFamilyTreeByUserId(userId));
    }

}

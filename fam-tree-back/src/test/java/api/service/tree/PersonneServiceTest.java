package api.service.tree;

import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.Relation;
import api.model.user.User;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationRepository;
import api.repository.user.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class PersonneServiceTest {

    @Mock
    private PersonneRepository personneRepository;

    @Mock
    private RelationRepository relationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FamilyTreeRepository familyTreeRepository;

    @InjectMocks
    private PersonneService personneService;

    private User user;
    private FamilyTree familyTree;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setId(1L);
        user.setPrivateCode("privateCode");
        familyTree = new FamilyTree();
        familyTree.setId(1L);

        lenient().when(userRepository.findByPrivateCode("privateCode")).thenReturn(user);
        lenient().when(familyTreeRepository.findByUserId(1L)).thenReturn(Optional.of(familyTree));
    }

    @BeforeEach
    public void setUpSecurityContext() {
        Authentication authentication = mock(Authentication.class);
        SecurityContext securityContext = mock(SecurityContext.class);
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        lenient().when(authentication.getPrincipal()).thenReturn(user.getPrivateCode());

        SecurityContextHolder.setContext(securityContext);
    }

    @AfterEach
    public void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void findByTreeIdTest() {
        Long treeId = 1L;
        List<Personne> mockPersonnes = new ArrayList<>();
        mockPersonnes.add(new Personne());

        when(personneRepository.findByTreeId(treeId)).thenReturn(mockPersonnes);

        List<Map<String, Object>> results = personneService.findByTreeId(treeId);

        verify(personneRepository).findByTreeId(treeId);
        assertFalse(results.isEmpty());
    }

    @Test
    void createAndSaveNewPersonTest() {
        Map<String, Object> personneData = new HashMap<>();
        personneData.put("name", "John Doe");
        Map<String, Long> idMapping = new HashMap<>();

        Personne newPerson = new Personne();
        newPerson.setId(1L);  // Assurez-vous que Personne a un ID valide après l'enregistrement.
        when(personneRepository.save(any(Personne.class))).thenReturn(newPerson);

        Long newPersonId = personneService.createAndSaveNewPerson(personneData, idMapping);

        assertNotNull(newPersonId);
        assertEquals(1L, newPersonId);
    }

    /*@Test
    void treeNodeManagingTest() {
        // Configuration initiale
        Long validPersonId = 1L;
        Personne existingPerson = new Personne();
        existingPerson.setId(validPersonId); // Assurez-vous que cet ID est valide et attendu

        Map<String, Object> validNodeData = new HashMap<>();
        validNodeData.put("id", validPersonId);

        // Simuler les données d'entrée avec un ID valide
        List<Map<String, Object>> addNodesData = Collections.singletonList(validNodeData);
        List<Map<String, Object>> updateNodesData = Collections.singletonList(validNodeData);

        Map<String, Object> updatedNode = new HashMap<>();
        updatedNode.put("addNodesData", addNodesData);
        updatedNode.put("updateNodesData", updateNodesData);
        updatedNode.put("removeNodeId", validPersonId);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("updatedNode", updatedNode);

        // Configuration des mocks pour répondre de manière attendue
        when(personneRepository.findById(validPersonId)).thenReturn(Optional.of(existingPerson));
        when(personneRepository.save(any(Personne.class))).thenReturn(existingPerson);
        doNothing().when(personneRepository).deleteById(validPersonId);

        // Exécuter la méthode testée
        personneService.treeNodeManaging(requestBody);

        // Vérifier les interactions et les résultats
        verify(personneRepository, times(4)).findById(validPersonId);
        verify(personneRepository).deleteById(validPersonId);
        // Ajoutez d'autres vérifications selon les besoins
    }*/


    @Test
    void updatePersonneTest() {
        Map<String, Object> nodeData = new HashMap<>();
        nodeData.put("id", 1L);
        nodeData.put("name", "Updated Name");
        Map<String, Long> idMapping = new HashMap<>();

        Personne existingPerson = new Personne();
        existingPerson.setId(1L);  // Simulez une Personne existante avec un ID valide.
        when(personneRepository.findById(1L)).thenReturn(Optional.of(existingPerson));
        when(personneRepository.save(any(Personne.class))).thenReturn(existingPerson);

        Long updatedPersonId = personneService.updatePersonne(nodeData, idMapping);

        assertEquals(1L, updatedPersonId);
    }

}

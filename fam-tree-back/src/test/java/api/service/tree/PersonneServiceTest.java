package api.service.tree;

import api.model.tree.FamilyTree;
import api.model.tree.Personne;
import api.model.tree.Relation;
import api.model.user.User;
import api.repository.tree.FamilyTreeRepository;
import api.repository.tree.PersonneRepository;
import api.repository.tree.RelationRepository;
import api.repository.tree.RelationshipConfirmationRepository;
import api.repository.user.UserRepository;
import api.service.relation.RelationshipConfirmationService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

    @Mock
    private RelationshipConfirmationRepository relationshipConfirmationRepository;

    @Mock
    private RelationshipConfirmationService relationshipConfirmationService;

    @InjectMocks
    private PersonneService personneService;

    private User user;
    private FamilyTree familyTree;
    private Personne personne;

    @BeforeEach
    public void setUp() {
        user = new User();
        user.setId(1L);
        user.setPrivateCode("privateCode");
        familyTree = new FamilyTree();
        familyTree.setId(1L);
        personne = new Personne();
        personne.setId(1L);
        personne.setTreeId(1L);

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

    @Test
    void findByTreeId_ValidTreeId_ReturnsCorrectData() {
        // Arrange
        Long validTreeId = 1L;
        List<Personne> mockPersonnes = new ArrayList<>();
        mockPersonnes.add(new Personne());

        when(personneRepository.findByTreeId(validTreeId)).thenReturn(mockPersonnes);
        when(familyTreeRepository.findByUser(any(User.class))).thenReturn(Optional.of(familyTree));

        // Act
        List<Map<String, Object>> results = personneService.findByTreeId(validTreeId);

        // Assert
        assertFalse(results.isEmpty());
        verify(personneRepository).findByTreeId(validTreeId);
    }

    @Test
    void findByTreeId_InvalidTreeId_ThrowsEntityNotFoundException() {
        // Arrange
        Long invalidTreeId = 99L;
        when(familyTreeRepository.findByUser(any(User.class))).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> personneService.findByTreeId(invalidTreeId));
    }

    @Test
    void createAndSaveNewPerson_ValidData_ReturnsNewPersonId() {
        // Arrange
        Map<String, Object> personneData = new HashMap<>();
        personneData.put("name", "John Doe");
        Map<String, Long> idMapping = new HashMap<>();
        List<Map<String, Object>> updateNodesList = new ArrayList<>();

        when(personneRepository.save(any(Personne.class))).thenReturn(personne);

        // Act
        Long newPersonId = personneService.createAndSaveNewPerson(personneData, idMapping, updateNodesList);

        // Assert
        assertNotNull(newPersonId);
        assertEquals(1L, newPersonId);
    }

    @Test
    void treeNodeManaging_ValidData_AddsUpdatesAndRemovesNodes() {
        // Arrange
        Long validPersonId = 1L;
        Personne existingPerson = new Personne();
        existingPerson.setId(validPersonId);

        Map<String, Object> validNodeData = new HashMap<>();
        validNodeData.put("id", validPersonId.toString());

        List<Map<String, Object>> addNodesData = Collections.singletonList(validNodeData);
        List<Map<String, Object>> updateNodesData = Collections.singletonList(validNodeData);

        Map<String, Object> updatedNode = new HashMap<>();
        updatedNode.put("addNodesData", addNodesData);
        updatedNode.put("updateNodesData", updateNodesData);
        updatedNode.put("removeNodeId", validPersonId.toString());

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("updatedNode", updatedNode);

        when(personneRepository.findById(validPersonId)).thenReturn(Optional.of(existingPerson));
        when(personneRepository.save(any(Personne.class))).thenReturn(existingPerson);

        // Act
        personneService.treeNodeManaging(requestBody);

        // Assert
        int expectedFindByIdTimes = 5;
        verify(personneRepository, times(expectedFindByIdTimes)).findById(validPersonId);
        verify(personneRepository).deleteById(validPersonId);
        // Add more verifications as necessary
    }


    /*@Test
    void updatePersonne_ValidData_UpdatesPersonne() {
        // Arrange
        Long validPersonId = 1L;
        Map<String, Object> nodeData = new HashMap<>();
        nodeData.put("id", validPersonId);
        nodeData.put("name", "Updated Name");
        Map<String, Long> idMapping = new HashMap<>();
        List<Map<String, Object>> updateNodesList = new ArrayList<>();

        Personne existingPerson = new Personne();
        existingPerson.setId(validPersonId);

        when(personneRepository.findById(validPersonId)).thenReturn(Optional.of(existingPerson));
        when(personneRepository.save(any(Personne.class))).thenReturn(existingPerson);

        // Act
        Long updatedPersonId = personneService.updatePersonne(nodeData, idMapping, updateNodesList);

        // Assert
        assertEquals(validPersonId, updatedPersonId);
        verify(personneRepository).save(existingPerson);
    }*/

    @Test
    void deleteRelationShipConfirmation_ValidData_DeletesConfirmation() {
        // Arrange
        Long targetMemberId = 1L;
        Personne targetPersonne = new Personne();
        targetPersonne.setId(targetMemberId);
        targetPersonne.setEmail("target@example.com");

        when(personneRepository.findById(targetMemberId)).thenReturn(Optional.of(targetPersonne));
        when(userRepository.findByEmail(targetPersonne.getEmail())).thenReturn(Optional.of(user));

        // Act
        personneService.deleteRelationShipConfirmation(targetMemberId);

        // Assert
        verify(relationshipConfirmationRepository).deleteBySourceMemberAndTargetMember(user, user);
    }
}
